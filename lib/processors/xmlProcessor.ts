import { XMLParser } from 'fast-xml-parser';

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

  const invoice = parsed.Invoice || parsed['fe:Invoice']; 

  if (!invoice) {
    throw new Error('El documento no es una factura XML válida');
  }

  const supplierParty = invoice['cac:AccountingSupplierParty']?.['cac:Party'];
  const taxTotal = invoice['cac:TaxTotal']?.['cbc:TaxAmount'];
  const legalMonetaryTotal = invoice['cac:LegalMonetaryTotal'];

  // Función para extraer el valor de forma segura
  const getXmlValue = (node: any) => {
    if (node === undefined || node === null) return null;
    return node['#text'] !== undefined ? node['#text'] : node;
  };

  const subtotalValue = getXmlValue(legalMonetaryTotal?.['cbc:LineExtensionAmount']);
  const taxValue = getXmlValue(taxTotal);
  const totalValue = getXmlValue(legalMonetaryTotal?.['cbc:PayableAmount']);

  // ÚNICO RETURN DE LA FUNCIÓN
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
}