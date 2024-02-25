export const instructions = {
    "text": `
Response Format:
- Respond in JSON format as an array of objects.
- Each object should contain a 'toothNumber' field prefixed with '#' and a 'treatments' field with an array of treatments.
- Maintain the sequence of treatments as they appear in the input.
- If anything is asked not related to this description or sample data, say "Error: Invalid Input Type".

FILLINGS INSTRUCTIONS: 
Teeth #s 1-5, 12-21, 28-32 are always considered posterior teeth. 
Teeth #s 6-11 and 22-27 are always considered anterior teeth.  
There are 7 possibilities of surfaces, M, O, D, B, L, B5, or L5. 
Each possibility can be used on it’s own, or in any combination, in no particular sequence. 
5 can be written as 5, V, (V) and can only be used in combination with B or L. 
If it is used in any other combination, display an error showing what the input was and say "Class 5 fillings can only be treatment planned for Buccal (B) or Lingual (L) surfaces. 
Filling material type is either composite or amalgam. 
If filling material is not specified, output "Error: " {input - including tooth number} " Filling type not specified. 
Amalgam filling types are not defined by Posterior or Anterior, only Composite is. 

CROWNS INSTRUCTIONS: 
Crowns are defined by materials. 
Input includes Porcelain Fused to Metal, which can also be written as PFM. 
Input can also include All Ceramic Crown, which can also be written as ACC. 
Input includes Full Metal Crown, which can also be written as FMC. 

ROOT CANAL INSTRUCTIONS: 
Root Canals have 3 categories, Root canal Anterior; Root canal Pre-Molar: Root Canal Molar. 
Root Canal Anterior corresponds with tooth #6-11, 22-27. 
Root Canal Pre-Molar corresponds with tooth #4, 5, 12, 13, 20, 21, 28, 29. 
Root Canal Molar corresponds with tooth # 1-3, 14-19, 30-32. 
Inputs for Root Canal can be written as " Root Canal or RCT ". 

BUILDUPS INSTRUCTIONS: 
Build ups can either include a post and core build up, or just a core build up. 

CBCT INSTRUCTIONS: 
CBCTs are categorized as Maxillary CBCT, Mandibular CBCT, or Upper and Lower. 
Maxillary is associated with #1-16, Mandibular is associated with 17-32. 
Upper and Lower will be specified as Upper and Lower. 

CROWN BRIDGES INSTRUCTIONS: 
These require a Retainer Crown, Pontic, and Retainer Crown. 
Retainer Crowns are categorized by material type; ACC, PFM, or FMC. 
If an implant is not specified for a tooth number and a bridge needs to be done, then a Retainer Crown is correct for that tooth. 
If a pontic is placed between two crowns and implants are not specified for those crowns, the crown is always considered a retainer crown. 
Bridge can also be specified as FPD. 

SINGLE IMPLANT INSTRUCTIONS: 
A tooth number asking for an implant will output "Single Implant". 

IMPLANT BRIDGE INSTRUCTIONS: 
If a retainer crown is being placed on a tooth with an implant, then that crown is an Implant Supported Retainer Crown. 
The crown material must specify either ACC or PFM. 

EXTRACTIONS INSTRUCTIONS: 
Extractions are either Surgical or Routine. 
If extraction type is not specified, prompt an error asking to specify extraction type. 
Extraction can also be written as ext. 

DENTURE INSTRUCTIONS: 
Dentures are classified as Upper Denture, Lower Denture, or Complete Denture. 
Upper Denture can only be outputted once. Lower Denture can only be outputted once. 
Complete Denture can only be outputted once. 
If an Upper Denture and Lower Denture is prompted, output "Complete Denture". 
If a Complete Denture is prompted along with an Upper or Lower Denture, output an error.
