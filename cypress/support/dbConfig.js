const config = {
  tableName2: 'eq_holding',                        //equity
  whereCondition2: `where client_id = '8733'`,
  tableName3: `advisor_po_policy`,               //Postal
  whereCondition3: `WHERE account IN ('45784587894','545478958','4578996544','545479632514','15458549','7878989798','5757575757','1474555')`,
  tableName4: `advisor_fd_policy`,               //FD
  whereCondition4: `WHERE receiptno IN (7894578, 321654655, 4444444, 560000, 96969, 45222566565, 250212) `,
  tableName5: 'commodity_holding',               //commodity
  whereCondition5: `where client_id = '8733'`,
  tableName6: 'property_holding',                //RealEstate
  whereCondition6: `where client_id = '8733'`,

  // General Insurance
  tableName7: `advisor_gi_policy`,               //Accidental-GI Policy
  whereCondition7: `WHERE arn_id='8' AND policyType LIKE '%Accidental%' AND ID='8733' ORDER BY schemeName ASC`,
  tableName8: `advisor_gi_policy`,               //vehicle-GI Policy
  whereCondition8: `WHERE arn_id='8' AND policyType LIKE '%vehicle%' AND ID='8733' ORDER BY vehicleName ASC`,
  tableName9: `advisor_gi_policy`,               //mediclaim-GI Policy
  whereCondition9: `WHERE arn_id='8' AND policyType LIKE '%mediclaim%' AND ID='8733' ORDER BY schemeName ASC`,
  tableName10: `advisor_gi_policy`,               //other-GI Policy
  whereCondition10: `WHERE arn_id = '8' and id = '8733' AND policyType NOT LIKE '%Vehicle%' AND policyType NOT LIKE '%Mediclaim%' AND policyType NOT LIKE '%Accidental%' and mdate > CURRENT_DATE`,

  //Life Insurance
  tableName11: `advisor_lic_policy`,               //Accidental-LI Policy
  whereCondition11: `WHERE arn_id='8' AND policyNumber IN ('7734','P7734'); `,

  //Live SIP 
  tableName12: `sip_details`,                     //SIP
  whereCondition12: `WHERE arn_id ='8' AND FolioNumber IN `,

};

module.exports = { config };
