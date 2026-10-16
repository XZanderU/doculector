import { XMLParser } from 'fast-xml-parser';

// Esta es la estructura común normalizada que todos los procesadores deben devolver
export interface ExtractedData {
  supplier_tax_id: string | null;
  supplier_name: string | null;
  invoice_number: string | null;
  issue_date: string | null;
  subtotal: number | null;
  tax_total: number | null;
  total: number | null;
  currency: string | null;
}

export async function processDIANXml(xmlString: string): Promise<ExtractedData> {
  const parser = new XMLParser({ ignoreAttributes: false });
  const parsed = parser.parse(xmlString);

  // Navegación segura por el árbol XML (UBL)
  // Nota: La estructura exacta varía según la versión de la DIAN, esto es una aproximación estándar UBL
  const invoice = parsed.Invoice || parsed['fe:Invoice']; 

  if (!invoice) {
    throw new Error('El documento no es una factura XML válida');
  }

  // Extracción segura (evitamos inventar datos si fallan)

   // Función para extraer el valor de forma segura
  const getXmlValue = (node: any) => {
    if (node === undefined || node === null) return null;
    return node['#text'] !== undefined ? node['#text'] : node;
  };

  const supplierParty = invoice['cac:AccountingSupplierParty']?.['cac:Party'];
  const taxTotal = invoice['cac:TaxTotal']?.['cbc:TaxAmount']?.['#text'];
  const legalMonetaryTotal = invoice['cac:LegalMonetaryTotal'];

  const subtotalValue = getXmlValue(legalMonetaryTotal?.['cbc:LineExtensionAmount']);
  const taxValue = getXmlValue(taxTotal);
  const totalValue = getXmlValue(legalMonetaryTotal?.['cbc:PayableAmount']);

  

  return {
    invoice_number: invoice['cbc:ID'] || null,
    issue_date: invoice['cbc:IssueDate'] || null,
    currency: invoice['cbc:DocumentCurrencyCode'] || 'COP',
    
    supplier_name: supplierParty?.['cac:PartyTaxScheme']?.['cbc:RegistrationName'] || null,
    supplier_tax_id: getXmlValue(supplierParty?.['cac:PartyTaxScheme']?.['cbc:CompanyID']),
    
    subtotal: subtotalValue !== null ? parseFloat(subtotalValue) : null,
    tax_total: taxValue !== null ? parseFloat(taxValue) : null,
    total: totalValue !== null ? parseFloat(totalValue) : null,
  };

  return {
    invoice_number: invoice['cbc:ID'] || null,
    issue_date: invoice['cbc:IssueDate'] || null,
    currency: invoice['cbc:DocumentCurrencyCode'] || 'COP',
    
    supplier_name: supplierParty?.['cac:PartyTaxScheme']?.['cbc:RegistrationName'] || null,
    supplier_tax_id: supplierParty?.['cac:PartyTaxScheme']?.['cbc:CompanyID']?.['#text'] || null,
    
    subtotal: legalMonetaryTotal?.['cbc:LineExtensionAmount']?.['#text'] ? parseFloat(legalMonetaryTotal['cbc:LineExtensionAmount']['#text']) : null,
    tax_total: taxTotal ? parseFloat(taxTotal) : null,
    total: legalMonetaryTotal?.['cbc:PayableAmount']?.['#text'] ? parseFloat(legalMonetaryTotal['cbc:PayableAmount']['#text']) : null,
  };
}

