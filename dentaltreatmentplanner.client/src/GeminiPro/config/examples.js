export const examples = [
    { text: "input: #5 MOD composite" },
    { text: "output: {\"#5\": [\"3 Surface Posterior Composite Filling\"]}" },
    { text: "input: #8 DOB5 composite" },
    { text: "output: {\"#8\": [\"3 Surface Anterior Composite Filling\"]}" },
    { text: "input: #7 DO composite\n#9 MOB5 composite\n#12 DOL/5 composite" },
    { text: "output: {\"#7\": [\"2 Surface Anterior Composite Filling\"], \"#9\": [\"3 Surface Anterior Composite Filling\"], \"#12\": [\"3 Surface Posterior Composite Filling\"]}" },
    { text: "input: #11 MOB5L5 comp" },
    { text: "output: {\"#11\": [\"4 Surface Anterior Composite Filling\"]}" },
    { text: "input: #10 MB5L-5 amalga" },
    { text: "output: {\"#10\": [\"3 Surface Amalgam Filling\"]}" },
    { text: "input: #9 MB(V)L(V) comp" },
    { text: "output: {\"#9\": [\"3 Surface Anterior Composite Filling\"]}" },
    { text: "input: #22 MOB-5L-5 comp" },
    { text: "output: {\"#22\": [\"4 Surface Anterior Composite Filling\"]}" },
    { text: "input: #24 MB-5L-5 amal" },
    { text: "output: {\"#24\": [\"3 Surface Amalgam Filling\"]}" },
    { text: "input: #1 MOD comp\n#3 DO comp\n#6 MOB/5L/5 amalg" },
    { text: "output: {\"#1\": [\"3 Surface Posterior Composite Filling\"], \"#3\": [\"2 Surface Posterior Composite Filling\"], \"#6\": [\"4 Surface Amalgam Filling\"]}" },
    { text: "input: #6 PFM crown" },
    { text: "output: {\"#6\": [\"PFM Crown\"]}" },
    { text: "input: #22 acc cronw" },
    { text: "output: {\"#22\": [\"ACC Crown\"]}" },
    { text: "input: #5 MOD comp\n#6 PFM crown\n#12 ACC crown" },
    { text: "output: {\"#5\": [\"3 Surface Posterior Composite Filling\"], \"#6\": [\"PFM Crown\"], \"#12\": [\"ACC Crown\"]}" },
    { text: "input: #5 needs a root canl" },
    { text: "output: {\"#5\": [\"Root Canal Pre-Molar\"]}" },
    { text: "input: #6 needs a root canal" },
    { text: "output: {\"#6\": [\"Root Canal Pre-Molar\"]}" },
    { text: "input: #19 needs a root canal" },
    { text: "output: {\"#19\": [\"Root Canal Molar\"]}" },
    { text: "input: #22 RCT" },
    { text: "output: {\"#22\": [\"Root Canal Anterior\"]}" },
    { text: "input: #1 rct" },
    { text: "output: {\"#1\": [\"Root Canal Molar\"]}" },
    { text: "input: #24 rct" },
    { text: "output: {\"#24\": [\"Root Canal Anterior\"]}" },
    { text: "input: #23 rct" },
    { text: "output: {\"#23\": [\"Root Canal Anterior\"]}" },
    { text: "input: #12 RCT" },
    { text: "output: {\"#12\": [\"Root Canal Pre-Molar\"]}" },
    { text: "input: #25 rct" },
    { text: "output: {\"#25\": [\"Root Canal Anterior\"]}" },
    { text: "input: #28 rct" },
    { text: "output: {\"#28\": [\"Root Canal Pre-Molar\"]}" },
    { text: "input: #6 rct" },
    { text: "output: {\"#6\": [\"Root Canal Anterior\"]}" },
    { text: "input: #8 rct" },
    { text: "output: {\"#8\": [\"Root Canal Anterior\"]}" },
    { text: "input: #9 RCT" },
    { text: "output: {\"#9\": [\"Root Canal Anterior\"]}" },
    { text: "input: #11 RCT" },
    { text: "output: {\"#11\": [\"Root Canal Anterior\"]}" },
    { text: "input: #16 rct" },
    { text: "output: {\"#16\": [\"Root Canal Molar\"]}" },
    { text: "input: #15 rct" },
    { text: "output: {\"#15\": [\"Root Canal Molar\"]}" },
    { text: "input: #5 pfm crn\n#6 RCT, acc" },
    { text: "output: {\"#5\": [\"PFM Crown\"], \"#6\": [\"Root Canal Anterior\", \"ACC Crown\"]}" },
    { text: "input: #15 build up" },
    { text: "output: {\"#15\": [\"Build Up w/o Post\"]}" },
    { text: "input: #1 build up with post" },
    { text: "output: {\"#1\": [\"Build Up w/ Post\"]}" },
    { text: "input: #5 core bu" },
    { text: "output: {\"#5\": [\"Build Up w/o Post\"]}" },
    { text: "input: #22 BU" },
    { text: "output: {\"#22\": [\"Build Up w/o Post\"]}" },
    { text: "input: #12 RCT + BU, acc" },
    { text: "output: {\"#12\": [\"Root Canal Pre-Molar\", \"Build Up w/o Post\", \"ACC Crown\"]}" },
    { text: "input: #22 needs a root canal with post and core, acc" },
    { text: "output: {\"#22\": [\"Root Canal Anterior\", \"Build Up w/ Post\", \"ACC Crown\"]}" },
    { text: "input: #12 needs a RCT with post + bu, acc" },
    { text: "output: {\"#12\": [\"Root Canal Pre-Molar\", \"Build Up w/ Post\", \"ACC Crown\"]}" },
    { text: "input: #15 rct - bu-post" },
    { text: "output: {\"#15\": [\"Root Canal Molar\", \"Build Up w/ Post\"]}" },
    { text: "input: #12 rct w/post BU and pfm" },
    { text: "output: {\"#12\": [\"Root Canal Pre-Molar\", \"Build Up w/ Post\", \"PFM Crown\"]}" },
    { text: "input: #14 cbct" },
    { text: "output: {\"#14\": [\"Maxillary CBCT\"]}" },
    { text: "input: upper and lower cbct" },
    { text: "output: {\"NA\": [\"Upper and Lower\"]}" },
    { text: "input: #12-14 acc bridge" },
    { text: "output: {\"#12\": [\"ACC Retainer Crown\"], \"#13\": [\"ACC Pontic\"], \"#14\": [\"ACC Retainer Crown\"]}" },
    { text: "input: #13-15 pfm bridge" },
    { text: "output: {\"#13\": [\"PFM Retainer Crown\"], \"#14\": [\"PFM Pontic\"], \"#15\": [\"PFM Retainer Crown\"]}" },
    { text: "input: #22-27 acc bridge" },
    { text: "output: {\"#22\": [\"ACC Retainer Crown\"], \"#23\": [\"ACC Pontic\"], \"#24\": [\"ACC Pontic\"], \"#25\": [\"ACC Pontic\"], \"#26\": [\"ACC Pontic\"], \"#27\": [\"ACC Retainer Crown\"]}" },
    { text: "input: #22 rct, core build up, post, acc crown\n#23 pontic\n#24 acc crown" },
    { text: "output: {\"#22\": [\"Root Canal Anterior\", \"Build Up w/ Post\", \"ACC Retainer Crown\"], \"#23\": [\"ACC Pontic\"], \"#24\": [\"ACC Retainer Crown\"]}" },
    { text: "input: #7 rct, build up, pfm crown\n#8 pontic\n#9 pfm" },
    { text: "output: {\"#7\": [\"Root Canal Anterior\", \"Build Up w/o Post\", \"PFM Retainer Crown\"], \"#8\": [\"ACC Pontic\"], \"#9\": [\"PFM Retainer Crown\"]}" },
    { text: "input: #12 acc" },
    { text: "output: {\"#12\": [\"ACC Crown\"]}" },
    { text: "input: #15 acc\n#16 pontic\n#17 acc" },
    { text: "output: {\"#15\": [\"ACC Retainer Crown\"], \"#16\": [\"ACC Pontic\"], \"#17\": [\"ACC Retainer Crown\"]}" },
    { text: "input: #14 acc\n#15 acc \n#16 acc" },
    { text: "output: {\"#14\": [\"ACC Crown\"], \"#15\": [\"ACC Crown\"], \"#16\": [\"ACC Crown\"]}" },
    { text: "input: #3 rct, build up, pfm\n#4 pontic\n#5 pfm" },
    { text: "output: {\"#3\": [\"Root Canal Anterior\", \"Build Up w/o Post\", \"PFM Retainer Crown\"], \"#4\": [\"PFM Pontic\"], \"#5\": [\"PFM Retainer Crown\"]}" },
    { text: "input: #12-15 acc fpd" },
    { text: "output: {\"#12\": [\"ACC Retainer Crown\"], \"#13\": [\"ACC Pontic\"], \"#14\": [\"ACC Pontic\"], \"#15\": [\"ACC Retainer Crown\"]}" },
    { text: "input: #2 MOD comp\n#3 DO comp\n#4 rct, build up, acc retainer crown\n#5 pontic\n#6 acc retainer crown" },
    { text: "output: {\"#2\": [\"3 Surface Posterior Composite Filling\"], \"#3\": [\"2 Surface Posterior Composite Filling\"], \"#4\": [\"Root Canal Pre-Molar\", \"Build Up w/o Post\", \"ACC Retainer Crown\"], \"#5\": [\"ACC Pontic\"], \"#6\": [\"ACC Retainer Crown\"]}" },
    { text: "input: #12 implant" },
    { text: "output: {\"#12\": [\"Single Implant\"]}" },
    { text: "input: #12-13, #22-23 implants w/acc" },
    { text: "output: {\"#12\": [\"Single Implant\", \"Implant Supported ACC Retainer Crown\"], \"#13\": [\"Single Implant\", \"Implant Supported ACC Retainer Crown\"], \"#22\": [\"Single Implant\", \"Implant Supported ACC Retainer Crown\"], \"#23\": [\"Single Implant\", \"Implant Supported ACC Retainer Crown\"]}" },
    { text: "input: #12-15 implant bridge w/acc" },
    { text: "output: {\"#12\": [\"Single Implant\", \"Implant Supported ACC Retainer Crown\"], \"#13\": [\"ACC Pontic\"], \"#14\": [\"ACC Pontic\"], \"#15\": [\"Single Implant\", \"Implant Supported ACC Retainer Crown\"]}" },
    { text: "input: #9-11 implant bridge with acc crowns" },
    { text: "output: {\"#9\": [\"Single Implant\", \"Implant Supported ACC Retainer Crown\"], \"#10\": [\"ACC Pontic\"], \"#11\": [\"Single Implant\", \"Implant Supported ACC Retainer Crown\"]}" },
    { text: "input: #12 ext surgical" },
    { text: "output: {\"#12\": [\"Surgical Extraction\"]}" },
    { text: "input: Upper denture" },
    { text: "output: \"Upper Denture\"" },
    { text: "input: Lower denture" },
    { text: "output: \"Lower Denture\"" },
    { text: "input: #12-14 single implant with crown" },
    { text: "output: {\"#12\": [\"#12-14 single implant with crown Please specify Implant Crown material type: ACC or PFM.\"]}" },
    { text: "input: #7-11 single implants with pfm crown" },
    { text: "output: {\"#7\": [\"Single Implant\", \"Implant Supported PFM Crown\"], \"#8\": [\"Single Implant\", \"Implant Supported PFM Crown\"], \"#9\": [\"Single Implant\", \"Implant Supported PFM Crown\"], \"#10\": [\"Single Implant\", \"Implant Supported PFM Crown\"], \"#11\": [\"Single Implant\", \"Implant Supported PFM Crown\"]}" },
    { text: "input: #9-11 implant bridge with pfm crowns" },
    { text: "output: {\"#9\": [\"Single Implant\", \"Implant Supported PFM Retainer Crown\"], \"#10\": [\"PFM Pontic\"], \"#11\": [\"Single Implant\", \"Implant Supported PFM Retainer Crown\"]}" },
    { text: "input: exts #7-11 with upper denture" },
    { text: "output: {\"#7\": [\"exts #7-11 with upper denture Please specify extraction type: Surgical or Routine.\"], \"NA\": [\"Upper Denture\"]}" },
    { text: "input: #12-17 surgical extractsions with upper denture" },
    { text: "output: {\"#12\": [\"Surgical Extraction\"], \"#13\": [\"Surgical Extraction\"], \"#14\": [\"Surgical Extraction\"], \"#15\": [\"Surgical Extraction\"], \"#16\": [\"Surgical Extraction\"], \"#17\": [\"Surgical Extraction\"], \"NA\": [\"Upper Denture\"]}" },
    { text: "input: maxillary denture" },
    { text: "output: {\"NA\": [\"Upper Denture\"]}" },
    { text: "input: mandibular denture" },
    { text: "output: {\"NA\": [\"Lower Denture\"]}" },
    { text: "input: upper cbct" },
    { text: "output: {\"NA\": [\"Maxillary CBCT\"]}" },
    { text: "input: lower cbct" },
    { text: "output: {\"NA\": [\"Mandibular CBCT\"]}" },
    { text: "input: #5 needs a root canal with post and core, pfm crown\n#6-11 will be a pfm bridge\n#11 will also need a root canal" },
    { text: "output: {\"#5\": [\"Root Canal Pre-Molar\", \"Build Up w/ Post\", \"PFM Crown\"], \"#6\": [\"PFM Retainer Crown\"], \"#7\": [\"PFM Pontic\"], \"#8\": [\"PFM Pontic\"], \"#9\": [\"PFM Pontic\"], \"#10\": [\"PFM Pontic\"], \"#11\": [\"Root Canal Anterior\", \"PFM Retainer Crown\"]}" },
    { text: "input: 12 MOD composite\n13 DOb-5 comp" },
    { text: "output: {\"#12\": [\"3 Surface Posterior Composite Filling\"], \"#13\": [\"3 Surface Posterior Composite Filling\"]}" },
    { text: "input: #7 rct, buildup w/post\n#7-9 acc bridge" },
    { text: "output: {\"#7\": [\"Root Canal Anterior\", \"Build Up w/ Post\", \"ACC Retainer Crown\"], \"#8\": [\"ACC Pontic\"], \"#9\": [\"ACC Retainer Crown\"]}" },
    { text: "input: #8 rct, buildup w/post\n#8-10 pfm bridge" },
    { text: "output: {\"#8\": [\"Root Canal Anterior\", \"Build Up w/ Post\", \"PFM Retainer Crown\"], \"#9\": [\"PFM Pontic\"], \"#10\": [\"PFM Retainer Crown\"]}" },
    { text: "input: #13 rct, buildup w/post\n#13-15 pfm bridge" },
    { text: "output: {\"#13\": [\"Root Canal Molar\", \"Build Up w/ Post\", \"PFM Retainer Crown\"], \"#14\": [\"PFM Pontic\"], \"#15\": [\"PFM Retainer Crown\"]}" },
    { text: "input: #5 MODB5 comp\n#8-11 acc bridge\n#12 rct, build up, post, pfm" },
    { text: "output: {\"#5\": [\"Surface Posterior Composite Filling\"], \"8\": [\"ACC Retainer Crown\"], \"9\": [\"ACC Pontic\"], \"10\": [\"ACC Pontic\"], \"11\": [\"ACC Retainer Crown\"], \"12\": [\"Root Canal Pre-Molar\", \"Build Up w/ Post\", \"PFM Crown\"]}" },
    { text: "input: #15 rct with buildup and acc" },
    { text: "output: {\"15\": [\"Root Canal Molar\", \"Build Up w/o Post\", \"ACC Crown\"]}" },
    { text: "input: #8 rct with buildup and 8-11 acc bridge" },
    { text: "output: {\"8\": [\"Root Canal Anterior\", \"Build Up w/o Post\", \"ACC Retainer Crown\"], \"9\": [\"ACC Pontic\"], \"10\": [\"ACC Pontic\"], \"11\": [\"ACC Retainer Crown\"]}" },
    { text: "input: #12 implant with acc\n#13 routine ext, implant with pfm\n#8 routine  ext\n#9 routine ext\n#10 routine ext\n#8-10 implant bridge with pfm" },
    { text: "output: {\"12\": [\"Single Implant\", \"Implant Supported ACC Retainer Crown\"], \"13\": [\"Routine Extraction\", \"Single Implant\", \"Implant Supported PFM Retainer Crown\"], \"8\": [\"Routine Extraction\", \"Single Implant\", \"Implant Supported PFM Retainer Crown\"], \"9\": [\"Routine Extraction\", \"PFM Pontic\"], \"10\": [\"Routine Extraction\", \"Single Implant\", \"Implant Supported PFM Retainer Crown\"]}" },
    { text: "input: #5 mob comp" },
    { text: "output: {\"#5\": [\"3 Surface Posterior Composite Filling\"]}" },
    { text: "input: #7 MOB/5L/5 amal" },
    { text: "output: {\"#7\": [\"4 Surface Amalgam Filling\"]}" },
    { text: "input: #12 MO amal" },
    { text: "output: {\"#12\": [\"2 Surface Amalgam Filling\"]}" },
    { text: "input: #5 ext" },
    { text: "output: {\"#5\": [\"#5 ext Please specify extraction type: Surgical or Routine.\"]}" },
    { text: "input: #12 ext" },
    { text: "output: {\"#12\": [\"#12 ext Please specify extraction type: Surgical or Routine.\"]}" },
    { text: "input: #6 needs a mod comp filling" },
    { text: "output: {\"#6\": [\"3 Surface Anterior Composite Filling\"]}" },
    { text: "input: #4 mod comp" },
    { text: "output: {\"#4\": [\"3 Surface Posterior Composite Filling\"]}" },
    { text: "input: #14 MOD composite" },
    { text: "output: {\"#14\": [\"3 Surface Posterior Composite Filling\"]}" },
    { text: "input: #22-24 acc bridge" },
    { text: "output: {\"#22\": [\"ACC Retainer Crown\"], \"#23\": [\"ACC Pontic\"], \"#24\": [\"ACC Retainer Crown\"]}" },
    { text: "input: #12-15 pfm fpd" },
    { text: "output: {\"#12\": [\"PFM Retainer Crown\"], \"#13\": [\"PFM Pontic\"], \"#14\": [\"PFM Pontic\"], \"#15\": [\"PFM Retainer Crown\"]}" },
    { text: "input: #12-15 accfpd" },
    { text: "output: {\"#12\": [\"ACC Retainer Crown\"], \"#13\": [\"ACC Pontic\"], \"#14\": [\"ACC Pontic\"], \"#15\": [\"ACC Retainer Crown\"]}" },
    { text: "input: #4 DO com\n#15 MOD amalg\n#22 rct build up fmc retainer crown\n#23 pontic\n#24 fmc retainer crown" },
    { text: "output: {\"#4\": [\"2 Surface Posterior Composite Filling\"], \"#15\": [\"3 Surface Amalgam Filling\"], \"#22\": [\"Root Canal Anterior\", \"Build Up w/o Post\", \"FMC Retainer Crown\"], \"#23\": [\"FMC Pontic\"], \"#24\": [\"FMC Retainer Crown\"]}" },
    { text: "input: #22 rct build up pfm retainer crown\n#23 pontic\n#24 pfm retainer crown" },
    { text: "output: {\"#22\": [\"Root Canal Anterior\", \"Build Up w/o Post\", \"PFM Retainer Crown\"], \"#23\": [\"PFM Pontic\"], \"#24\": [\"PFM Retainer Crown\"]}" },
    { text: "input: #22 rct build up \n22-24 acc bridge" },
    { text: "output: {\"#22\": [\"Root Canal Anterior\", \"Build Up w/o Post\", \"ACC Retainer Crown\"], \"#23\": [\"ACC Pontic\"], \"#24\": [\"ACC Retainer Crown\"]}" },
    { text: "input: #7-9 implant bridge with acc" },
    { text: "output: {\"#7\": [\"Single Implant\", \"Implant ACC Retainer Crown\"], \"#8\": [\"ACC Pontic\"], \"#9\": [\"Single Implant\", \"Implant ACC Retainer Crown\"]}" },
    { text: "input: #15 ext routine" },
    { text: "output: {\"#15\": [\"Routine Extraction\"]}" },
    { text: "input: #12-15 surgical extractions" },
    { text: "output: {\"#12\": [\"Surgical Extraction\"], \"#13\": [\"Surgical Extraction\"], \"#14\": [\"Surgical Extraction\"], \"#15\": [\"Surgical Extraction\"]}" },
    { text: "input: #3-5 single implants with pfm crowns" },
    { text: "output: {\"#3\": [\"Single Implant\", \"Implant Supported PFM Crown\"], \"#4\": [\"Single Implant\", \"Implant Supported PFM Crown\"], \"#5\": [\"Single Implant\", \"Implant Supported PFM Crown\"]}" },
    { text: "input: #13 pfm crown" },
    { text: "output: {\"#13\": [\"PFM Crown\"]}" },
    { text: "input: #5 rct buildup post with acc\n#6-8 pfm bridge\n#14 MOD comp" },
    { text: "output: {\"#5\": [\"Root Canal Pre-Molar\", \"Build Up w/ Post\", \"ACC Crown\"], \"#6\": [\"PFM Retainer Crown\"], \"#7\": [\"PFM Pontic\"], \"#8\": [\"PFM Retainer Crown\"], \"#14\": [\"3 Surface Posterior Composite Filling\"]}" },
    { text: "input: #3 needs an MOB-5 comp\n#6 rct, build up with post\n#6-11 pfm bridge\n#11 rct build up" },
    { text: "output: {\"#3\": [\"3 Surface Posterior Composite Filling\"], \"#6\": [\"Root Canal Anterior\", \"Build Up w/ Post\", \"PFM Retainer Crown\"], \"#7\": [\"PFM Pontic\"], \"#8\": [\"PFM Pontic\"], \"#9\": [\"PFM Pontic\"], \"#10\": [\"PFM Pontic\"], \"#11\": [\"Root Canal Anterior\", \"Build Up w/o Post\", \"PFM Retainer Crown\"]}" },
    { text: "input: " },
    { text: "output: " }
];
