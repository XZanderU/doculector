import { describe, it, expect } from '@jest/globals';
import { processDIANXml } from './xmlProcessor';
// ... resto de tu código

describe('processDIANXml', () => {
  it('debe extraer correctamente los datos numéricos y de texto', async () => {
    const validXml = `
      <Invoice>
        <cbc:ID>FAC-001</cbc:ID>
        <cac:LegalMonetaryTotal>
          <cbc:PayableAmount>150000.50</cbc:PayableAmount>
        </cac:LegalMonetaryTotal>
      </Invoice>
    `;
    const result = await processDIANXml(validXml);
    expect(result.invoice_number).toBe('FAC-001');
    expect(result.total).toBe(150000.50);
  });

  it('debe devolver null si el impuesto no existe, respetando la regla de no inventar valores', async () => {
    // XML intencionalmente sin la etiqueta cac:TaxTotal
    const incompleteXml = `
      <Invoice>
        <cbc:ID>FAC-002</cbc:ID>
      </Invoice>
    `;
    const result = await processDIANXml(incompleteXml);
    expect(result.tax_total).toBeNull();
  });
});