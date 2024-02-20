export const examples =
    [
        {
            "text": "input: #5 MOD composite"
        },
        {
            "text": "output: [{\"toothNumber\": \"#5\", \"treatments\": [\"3 Surface Posterior Composite Filling\"]}]"
        },
        {
            "text": "input: #8 DOB5 composite"
        },
        {
            "text": "output: [{\"toothNumber\": \"#8\", \"treatments\": [\"3 Surface Anterior Composite Filling\"]}]"
        },
        {
            "text": "input: #7 DO composite\n#9 MOB5 composite\n#12 DOL/5 composite"
        },
        {
            "text": "output: [{\"toothNumber\": \"#7\", \"treatments\": [\"2 Surface Anterior Composite Filling\"]},\n{\"toothNumber\": \"#9\", \"treatments\": [\"3 Surface Anterior Composite Filling\"]},\n{\"toothNumber\": \"#12\", \"treatments\": [\"3 Surface Posterior Composite Filling\"]}]"
        },
        {
            "text": "input: #11 MOB5L5 comp"
        },
        {
            "text": "output: [{\"toothNumber\": \"#11\", \"treatments\": [\"4 Surface Anterior Composite Filling\"]}]"
        },
        {
            "text": "input: #10 MB5L-5 amalga"
        },
        {
            "text": "output: [{\"toothNumber\": \"#10\", \"treatments\": [\"3 Surface Amalgam Filling\"]}]"
        },
        {
            "text": "input: #9 MB(V)L(V) comp"
        },
        {
            "text": "output: [{\"toothNumber\": \"#9\", \"treatments\": [\"3 Surface Anterior Composite Filling\"]}]"
        },
        {
            "text": "input: #22 MOB-5L-5 comp"
        },
        {
            "text": "output: [{\"toothNumber\": \"#22\", \"treatments\": [\"4 Surface Anterior Composite Filling\"]}]"
        },
        {
            "text": "input: #24 MB-5L-5 amal"
        },
        {
            "text": "output: [{\"toothNumber\": \"#24\", \"treatments\": [\"3 Surface Amalgam Filling\"]}]"
        },
        {
            "text": "input: #1 MOD comp\n#3 DO comp\n#6 MOB/5L/5 amalg"
        },
        {
            "text": "output: [{\"toothNumber\": \"#1\", \"treatments\": [\"3 Surface Posterior Composite Filling\"]},\n{\"toothNumber\": \"#3\", \"treatments\": [\"2 Surface Posterior Composite Filling\"]},\n{\"toothNumber\": \"#6\", \"treatments\": [\"4 Surface Amalgam Filling\"]}]"
        },
        {
            "text": "input: #6 PFM crown"
        },
        {
            "text": "output: [{\"toothNumber\": \"#6\", \"treatments\": [\"PFM Crown\"]}]"
        },
        {
            "text": "input: #22 acc cronw"
        },
        {
            "text": "output: [{\"toothNumber\": \"#22\", \"treatments\": [\"ACC Crown\"]}]"
        },
        {
            "text": "input: #5 MOD comp\n#6 PFM crown\n#12 ACC crown"
        },
        {
            "text": "output: [{\"toothNumber\":\"#5\",\"treatments\":[\"3 Surface Posterior Composite Filling\"]},{\"toothNumber\":\"#6\",\"treatments\":[\"PFM Crown\"]},{\"toothNumber\":\"#12\",\"treatments\":[\"ACC Crown\"]}]"
        },
        {
            "text": "input: #5 needs a root canl"
        },
        {
            "text": "output: [{\"toothNumber\": \"#5\", \"treatments\": [\"Root Canal Pre-Molar\"]}]"
        },
        {
            "text": "input: #6 needs a root canal"
        },
        {
            "text": "output: [{\"toothNumber\": \"#6\", \"treatments\": [\"Root Canal Pre-Molar\"]}]"
        },
        {
            "text": "input: #19 needs a root canal"
        },
        {
            "text": "output: [{\"toothNumber\": \"#19\", \"treatments\": [\"Root Canal Molar\"]}]"
        },
        {
            "text": "input: #22 RCT"
        },
        {
            "text": "output: [{\"toothNumber\": \"#22\", \"treatments\": [\"Root Canal Anterior\"]}"
        },
        {
            "text": "input: #1 rct"
        },
        {
            "text": "output: [{\"toothNumber\": \"#1\", \"treatments\": [\"Root Canal Molar\"]}]"
        },
        {
            "text": "input: #24 rct"
        },
        {
            "text": "output: [{\"toothNumber\": \"#24\", \"treatments\": [\"Root Canal Anterior\"]}]"
        },
        {
            "text": "input: #23 rct"
        },
        {
            "text": "output: [{\"toothNumber\": \"#23\", \"treatments\": [\"Root Canal Anterior\"]}]"
        },
        {
            "text": "input: #12 RCT"
        },
        {
            "text": "output: [{\"toothNumber\": \"#12\", \"treatments\": [\"Root Canal Pre-Molar\"]}]"
        },
        {
            "text": "input: #25 rct"
        },
        {
            "text": "output: [{\"toothNumber\": \"#25\", \"treatments\": [\"Root Canal Anterior\"]}]"
        },
        {
            "text": "input: #28 rct"
        },
        {
            "text": "output: [{\"toothNumber\": \"#28\", \"treatments\": [\"Root Canal Pre-Molar\"]}]"
        },
        {
            "text": "input: #6 rct"
        },
        {
            "text": "output: [{\"toothNumber\": \"#6\", \"treatments\": [\"Root Canal Anterior\"]}]"
        },
        {
            "text": "input: #8 rct"
        },
        {
            "text": "output: [{\"toothNumber\": \"#8\", \"treatments\": [\"Root Canal Anterior\"]}]"
        },
        {
            "text": "input: #9 RCT"
        },
        {
            "text": "output: [{\"toothNumber\": \"#9\", \"treatments\": [\"Root Canal Anterior\"]}]"
        },
        {
            "text": "input: #11 RCT"
        },
        {
            "text": "output: [{\"toothNumber\": \"#11\", \"treatments\": [\"Root Canal Anterior\"]}]"
        },
        {
            "text": "input: #16 rct"
        },
        {
            "text": "output: [{\"toothNumber\": \"#16\", \"treatments\": [\"Root Canal Molar\"]}]"
        },
        {
            "text": "input: #15 rct"
        },
        {
            "text": "output: [{\"toothNumber\": \"#15\", \"treatments\": [\"Root Canal Molar\"]}]"
        },
        {
            "text": "input: #5 pfm crn\n#6 RCT, acc"
        },
        {
            "text": "output: [{\"toothNumber\": \"#5\", \"treatments\": [\"PFM Crown\"]},\n{\"toothNumber\": \"#6\", \"treatments\": [\"Root Canal Anterior\", \"ACC Crown\"]}]"
        },
        {
            "text": "input: #15 build up"
        },
        {
            "text": "output: [{\"toothNumber\": \"#15\", \"treatments\": [\"Build Up w/o Post\"]}]"
        },
        {
            "text": "input: #1 build up with post"
        },
        {
            "text": "output: [{\"toothNumber\": \"#1\", \"treatments\": [\"Build Up w/ Post\"]}]"
        },
        {
            "text": "input: #5 core bu"
        },
        {
            "text": "output: [{\"toothNumber\": \"#5\", \"treatments\": [\"Build Up w/o Post\"]}]"
        },
        {
            "text": "input: #22 BU"
        },
        {
            "text": "output: [{\"toothNumber\": \"#22\", \"treatments\": [\"Build Up w/o Post\"]}]"
        },
        {
            "text": "input: #12 RCT + BU, acc"
        },
        {
            "text": "output: [{\"toothNumber\": \"#12\", \"treatments\": [\"Root Canal Pre-Molar\", \"Build Up w/o Post\", \"ACC Crown\"]}]"
        },
        {
            "text": "input: #22 needs a root canal with post and core, acc"
        },
        {
            "text": "output: [{\"toothNumber\": \"#22\", \"treatments\": [\"Root Canal Anterior\", \"Build Up w/ Post\", \"ACC Crown\"]}]"
        },
        {
            "text": "input: #12 needs a RCT with post + bu, acc"
        },
        {
            "text": "output: [{\"toothNumber\": \"#12\", \"treatments\": [\"Root Canal Pre-Molar\", \"Build Up w/ Post\", \"ACC Crown\"]}]"
        },
        {
            "text": "input: #15 rct - bu-post"
        },
        {
            "text": "output: [{\"toothNumber\": \"#15\", \"treatments\": [\"Root Canal Molar\", \"Build Up w/ Post\"]}]"
        },
        {
            "text": "input: #12 rct w/post BU and pfm"
        },
        {
            "text": "output: [{\"toothNumber\": \"#12\", \"treatments\": [\"Root Canal Pre-Molar\", \"Build Up w/ Post\", \"PFM Crown\"]}]"
        },
        {
            "text": "input: #14 cbct"
        },
        {
            "text": "output: [{\"toothNumber\": \"#14\", \"treatments\": [\"Maxillary CBCT\"]}]"
        },
        {
            "text": "input: upper and lower cbct"
        },
        {
            "text": "output: [{\"toothNumber\": \"NA\", \"treatments\": [\"Upper and Lower\"]}]"
        },
        {
            "text": "input: #12-14 acc bridge"
        },
        {
            "text": "output: [{\"toothNumber\":\"#12\",\"treatments\":[\"ACC Retainer Crown\"]},{\"toothNumber\":\"#13\",\"treatments\":[\"ACC Pontic\"]},{\"toothNumber\":\"#14\",\"treatments\":[\"ACC Retainer Crown\"]}]"
        },
        {
            "text": "input: #13-15 pfm bridge"
        },
        {
            "text": "output: [{\"toothNumber\":\"#13\",\"treatments\":[\"PFM Retainer Crown\"]},{\"toothNumber\":\"#14\",\"treatments\":[\"PFM Pontic\"]},{\"toothNumber\":\"#15\",\"treatments\":[\"PFM Retainer Crown\"]}]"
        },
        {
            "text": "input: #22-27 acc bridge"
        },
        {
            "text": "output: [{\"toothNumber\":\"#22\",\"treatments\":[\"ACC Retainer Crown\"]},{\"toothNumber\":\"#23\",\"treatments\":[\"ACC Pontic\"]},{\"toothNumber\":\"#24\",\"treatments\":[\"ACC Pontic\"]},{\"toothNumber\":\"#25\",\"treatments\":[\"ACC Pontic\"]},{\"toothNumber\":\"#26\",\"treatments\":[\"ACC Pontic\"]},{\"toothNumber\":\"#27\",\"treatments\":[\"ACC Retainer Crown\"]}]"
        },
        {
            "text": "input: #22 rct, core build up, post, acc crown\n#23 pontic\n#24 acc crown"
        },
        {
            "text": "output: [{\"toothNumber\":\"#22\",\"treatments\":[\"Root Canal Anterior\",\"Build Up w/ Post\",\"ACC Retainer Crown\"]},{\"toothNumber\":\"#23\",\"treatments\":[\"ACC Pontic\"]},{\"toothNumber\":\"#24\",\"treatments\":[\"ACC Retainer Crown\"]}]"
        },
        {
            "text": "input: #7 rct, build up, pfm crown\n#8 pontic\n#9 pfm"
        },
        {
            "text": "output: [{\"toothNumber\":\"#7\",\"treatments\":[\"Root Canal Anterior\",\"Build Up w/o Post\",\"PFM Retainer Crown\"]},{\"toothNumber\":\"#8\",\"treatments\":[\"ACC Pontic\"]},{\"toothNumber\":\"#9\",\"treatments\":[\"PFM Retainer Crown\"]}]"
        },
        {
            "text": "input: #12 acc"
        },
        {
            "text": "output: [{\"toothNumber\": \"#12\", \"treatments\": [\"ACC Crown\"]}]"
        },
        {
            "text": "input: #15 acc\n#16 pontic\n#17 acc"
        },
        {
            "text": "output: [{\"toothNumber\":\"#15\",\"treatments\":[\"ACC Retainer Crown\"]},{\"toothNumber\":\"#16\",\"treatments\":[\"ACC Pontic\"]},{\"toothNumber\":\"#17\",\"treatments\":[\"ACC Retainer Crown\"]}]"
        },
        {
            "text": "input: #14 acc\n#15 acc \n#16 acc"
        },
        {
            "text": "output: [{\"toothNumber\":\"#14\",\"treatments\":[\"ACC Crown\"]},{\"toothNumber\":\"#15\",\"treatments\":[\"ACC Crown\"]},{\"toothNumber\":\"#16\",\"treatments\":[\"ACC Crown\"]}]"
        },
        {
            "text": "input: #3 rct, build up, pfm\n#4 pontic\n#5 pfm"
        },
        {
            "text": "output: [{\"toothNumber\":\"#3\",\"treatments\":[\"Root Canal Anterior\",\"Build Up w/o Post\",\"PFM Retainer Crown\"]},{\"toothNumber\":\"#4\",\"treatments\":[\"PFM Pontic\"]},{\"toothNumber\":\"#5\",\"treatments\":[\"PFM Retainer Crown\"]}]"
        },
        {
            "text": "input: #12-15 acc fpd"
        },
        {
            "text": "output: [{\"toothNumber\":\"#12\",\"treatments\":[\"ACC Retainer Crown\"]},{\"toothNumber\":\"#13\",\"treatments\":[\"ACC Pontic\"]},{\"toothNumber\":\"#14\",\"treatments\":[\"ACC Pontic\"]},{\"toothNumber\":\"#15\",\"treatments\":[\"ACC Retainer Crown\"]}]"
        },
        {
            "text": "input: #2 MOD comp\n#3 DO comp\n#4 rct, build up, acc retainer crown\n#5 pontic\n#6 acc retainer crown"
        },
        {
            "text": "output: [{\"toothNumber\":\"#2\",\"treatments\":[\"3 Surface Posterior Composite Filling\"]},{\"toothNumber\":\"#3\",\"treatments\":[\"2 Surface Posterior Composite Filling\"]},{\"toothNumber\":\"#4\",\"treatments\":[\"Root Canal Pre-Molar\",\"Build Up w/o Post\",\"ACC Retainer Crown\"]},{\"toothNumber\":\"#5\",\"treatments\":[\"ACC Pontic\"]},{\"toothNumber\":\"#6\",\"treatments\":[\"ACC Retainer Crown\"]}]"
        },
        {
            "text": "input: #12 implant"
        },
        {
            "text": "output: [{\"toothNumber\": \"#12\", \"treatments\": [\"Single Implant\"]}]"
        },
        {
            "text": "input: #12-13, #22-23 implants w/acc"
        },
        {
            "text": "output: [{\"toothNumber\":\"#12\",\"treatments\":[\"Single Implant\",\"Implant Supported ACC Retainer Crown\"]},{\"toothNumber\":\"#13\",\"treatments\":[\"Single Implant\",\"Implant Supported ACC Retainer Crown\"]},{\"toothNumber\":\"#22\",\"treatments\":[\"Single Implant\",\"Implant Supported ACC Retainer Crown\"]},{\"toothNumber\":\"#23\",\"treatments\":[\"Single Implant\",\"Implant Supported ACC Retainer Crown\"]}]"
        },
        {
            "text": "input: #12-15 implant bridge w/acc"
        },
        {
            "text": "output: [{\"toothNumber\":\"#12\",\"treatments\":[\"Single Implant\",\"Implant Supported ACC Retainer Crown\"]},{\"toothNumber\":\"#13\",\"treatments\":[\"ACC Pontic\"]},{\"toothNumber\":\"#14\",\"treatments\":[\"ACC Pontic\"]},{\"toothNumber\":\"#15\",\"treatments\":[\"Single Implant\",\"Implant Supported ACC Retainer Crown\"]}]"
        },
        {
            "text": "input: #9-11 implant bridge with acc crowns"
        },
        {
            "text": "output: [{\"toothNumber\":\"#9\",\"treatments\":[\"Single Implant\",\"Implant Supported ACC Retainer Crown\"]},{\"toothNumber\":\"#10\",\"treatments\":[\"ACC Pontic\"]},{\"toothNumber\":\"#11\",\"treatments\":[\"Single Implant\",\"Implant Supported ACC Retainer Crown\"]}]"
        },
        {
            "text": "input: #12 ext surgical"
        },
        {
            "text": "output: [{\"toothNumber\": \"#12\", \"treatments\": [\"Surgical Extraction\"]}]"
        },
        {
            "text": "input: Upper denture"
        },
        {
            "text": "output: [{\"toothNumber\": \"NA\", \"treatments\": [\"Upper Denture\"]}]"
        },
        {
            "text": "input: Lower denture"
        },
        {
            "text": "output: [{\"toothNumber\": \"NA\", \"treatments\": [\"Lower Denture\"]}]"
        },
        {
            "text": "input: #12-14 single implant with crown"
        },
        {
            "text": "output: [{\"toothNumber\": \"#12\", \"treatments\": [\"#12-14 single implant with crown Please specify Implant Crown material type: ACC or PFM.\"]}]"
        },
        {
            "text": "input: #7-11 single implants with pfm crown"
        },
        {
            "text": "output: [{\"toothNumber\":\"#7\",\"treatments\":[\"Single Implant\",\"Implant Supported PFM Crown\"]},{\"toothNumber\":\"#8\",\"treatments\":[\"Single Implant\",\"Implant Supported PFM Crown\"]},{\"toothNumber\":\"#9\",\"treatments\":[\"Single Implant\",\"Implant Supported PFM Crown\"]},{\"toothNumber\":\"#10\",\"treatments\":[\"Single Implant\",\"Implant Supported PFM Crown\"]},{\"toothNumber\":\"#11\",\"treatments\":[\"Single Implant\",\"Implant Supported PFM Crown\"]}]"
        },
        {
            "text": "input: #9-11 implant bridge with pfm crowns"
        },
        {
            "text": "output: [{\"toothNumber\":\"#9\",\"treatments\":[\"Single Implant\",\"Implant Supported PFM Retainer Crown\"]},{\"toothNumber\":\"#10\",\"treatments\":[\"PFM Pontic\"]},{\"toothNumber\":\"#11\",\"treatments\":[\"Single Implant\",\"Implant Supported PFM Retainer Crown\"]}]"
        },
        {
            "text": "input: exts #7-11 with upper denture"
        },
        {
            "text": "output: [{\"toothNumber\":\"#7\",\"treatments\":[\"exts #7-11 with upper denture Please specify extraction type: Surgical or Routine.\"]},{\"toothNumber\":\"NA\",\"treatments\":[\"Upper Denture\"]}]"
        },
        {
            "text": "input: #12-17 surgical extractsions with upper denture"
        },
        {
            "text": "output: [{\"toothNumber\":\"#12\",\"treatments\":[\"Surgical Extraction\"]},{\"toothNumber\":\"#13\",\"treatments\":[\"Surgical Extraction\"]},{\"toothNumber\":\"#14\",\"treatments\":[\"Surgical Extraction\"]},{\"toothNumber\":\"#15\",\"treatments\":[\"Surgical Extraction\"]},{\"toothNumber\":\"#16\",\"treatments\":[\"Surgical Extraction\"]},{\"toothNumber\":\"#17\",\"treatments\":[\"Surgical Extraction\"]},{\"toothNumber\":\"NA\",\"treatments\":[\"Upper Denture\"]}]"
        },
        {
            "text": "input: maxillary denture"
        },
        {
            "text": "output: [{\"toothNumber\": \"NA\", \"treatments\": [\"Upper Denture\"]}]"
        },
        {
            "text": "input: mandibular denture"
        },
        {
            "text": "output: [{\"toothNumber\": \"NA\", \"treatments\": [\"Lower Denture\"]}]"
        },
        {
            "text": "input: upper cbct"
        },
        {
            "text": "output: [{\"toothNumber\": \"NA\", \"treatments\": [\"Maxillary CBCT\"]}]"
        },
        {
            "text": "input: lower cbct"
        },
        {
            "text": "output: [{\"toothNumber\": \"NA\", \"treatments\": [\"Mandibular CBCT\"]}]"
        },
        {
            "text": "input: #5 needs a root canal with post and core, pfm crown\n#6-11 will be a pfm bridge\n#11 will also need a root canal"
        },
        {
            "text": "output: [{\"toothNumber\":\"#5\",\"treatments\":[\"Root Canal Pre-Molar\",\"Build Up w/ Post\",\"PFM Crown\"]},{\"toothNumber\":\"#6\",\"treatments\":[\"PFM Retainer Crown\"]},{\"toothNumber\":\"#7\",\"treatments\":[\"PFM Pontic\"]},{\"toothNumber\":\"#8\",\"treatments\":[\"PFM Pontic\"]},{\"toothNumber\":\"#9\",\"treatments\":[\"PFM Pontic\"]},{\"toothNumber\":\"#10\",\"treatments\":[\"PFM Pontic\"]},{\"toothNumber\":\"#11\",\"treatments\":[\"Root Canal Anterior\",\"PFM Retainer Crown\"]}]"
        },
        {
            "text": "input: 12 MOD composite\n13 DOb-5 comp"
        },
        {
            "text": "output: [{\"toothNumber\":\"#12\",\"treatments\":[\"3 Surface Posterior Composite Filling\"]},{\"toothNumber\":\"#13\",\"treatments\":[\"3 Surface Posterior Composite Filling\"]}]"
        },
        {
            "text": "input: #7 rct, buildup w/post\n#7-9 acc bridge"
        },
        {
            "text": "output: [{\"toothNumber\":\"#7\",\"treatments\":[\"Root Canal Anterior\",\"Build Up w/ Post\",\"ACC Retainer Crown\"]},{\"toothNumber\":\"#8\",\"treatments\":[\"ACC Pontic\"]},{\"toothNumber\":\"#9\",\"treatments\":[\"ACC Retainer Crown\"]}]"
        },
        {
            "text": "input: #8 rct, buildup w/post\n#8-10 pfm bridge"
        },
        {
            "text": "output: [{\"toothNumber\": \"#8\", \"treatments\": [\"Root Canal Anterior\", \"Build Up w/ Post\", \"PFM Retainer Crown\"]}, {\"toothNumber\": \"#9\", \"treatments\": [\"PFM Pontic\"]}, {\"toothNumber\": \"#10\", \"treatments\": [\"PFM Retainer Crown\"]}]"
        },
        {
            "text": "input: #13 rct, buildup w/post\n#13-15 pfm bridge"
        },
        {
            "text": "output: [{\"toothNumber\": \"#13\", \"treatments\": [\"Root Canal Molar\", \"Build Up w/ Post\", \"PFM Retainer Crown\"]}, {\"toothNumber\": \"#14\", \"treatments\": [\"PFM Pontic\"]}, {\"toothNumber\": \"#15\", \"treatments\": [\"PFM Retainer Crown\"]}]"
        },
        {
            "text": "input: #5 MODB5 comp\n#8-11 acc bridge\n#12 rct, build up, post, pfm"
        },
        {
            "text": "output: [{\"toothNumber\":\"#5\",\"treatments\":[\"Surface Posterior Composite Filling\"]},{\"toothNumber\":\"8\",\"treatments\":[\"ACC Retainer Crown\"]},{\"toothNumber\":\"9\",\"treatments\":[\"ACC Pontic\"]},{\"toothNumber\":\"10\",\"treatments\":[\"ACC Pontic\"]},{\"toothNumber\":\"11\",\"treatments\":[\"ACC Retainer Crown\"]},{\"toothNumber\":\"#12\",\"treatments\":[\"Root Canal Pre-Molar\",\"Build Up w/ Post\",\"PFM Crown\"]}]"
        },
        {
            "text": "input: #15 rct with buildup and acc"
        },
        {
            "text": "output: [{\"toothNumber\": \"15\", \"treatments\": [\"Root Canal Molar\", \"Build Up w/o Post\", \"ACC Crown\"]}]"
        },
        {
            "text": "input: #8 rct with buildup and 8-11 acc bridge"
        },
        {
            "text": "output: [{\"toothNumber\":\"8\",\"treatments\":[\"Root Canal Anterior\",\"Build Up w/o Post\",\"ACC Retainer Crown\"]},{\"toothNumber\":\"9\",\"treatments\":[\"ACC Pontic\"]},{\"toothNumber\":\"10\",\"treatments\":[\"ACC Pontic\"]},{\"toothNumber\":\"11\",\"treatments\":[\"ACC Retainer Crown\"]}]"
        },
        {
            "text": "input: #12 implant with acc\n#13 routine ext, implant with pfm\n#8 routine  ext\n#9 routine ext\n#10 routine ext\n#8-10 implant bridge with pfm"
        },
        {
            "text": "output: [{\"toothNumber\": \"12\", \"treatments\": [\"Single Implant\", \"Implant Supported ACC Retainer Crown\"]},\n{\"toothNumber\": \"13\", \"treatments\": [\"Routine Extraction\", \"Single Implant\", \"Implant Supported PFM Retainer Crown\"]}, {\"toothNumber\": \"8\", \"treatments\": [\"Routine Extraction\", \"Single Implant\", \"Implant Supported PFM Retainer Crown\"]}, {\"toothNumber\": \"9\", \"treatments\": [\"Routine Extraction\", \"PFM Pontic\"]}, {\"toothNumber\": \"10\", \"treatments\": [\"Routine Extraction\", \"Single Implant\", \"Implant Supported PFM Retainer Crown\"]}]"
        },
        {
            "text": "input: #5 mob comp"
        },
        {
            "text": "output: [{\"toothNumber\": \"#5\", \"treatments\": [\"3 Surface Posterior Composite Filling\"]}]"
        },
        {
            "text": "input: #7 MOB/5L/5 amal"
        },
        {
            "text": "output: [{\"toothNumber\": \"#7\", \"treatments\": [\"4 Surface Amalgam Filling\"]}]"
        },
        {
            "text": "input: #12 MO amal"
        },
        {
            "text": "output: [{\"toothNumber\": \"#12\", \"treatments\": [\"2 Surface Amalgam Filling\"]}]"
        },
        {
            "text": "input: #5 ext"
        },
        {
            "text": "output: [{\"toothNumber\": \"#5\", \"treatments\": [\"#5 ext Please specify extraction type: Surgical or Routine.\"]}]"
        },
        {
            "text": "input: #12 ext"
        },
        {
            "text": "output: [{\"toothNumber\": \"#12\", \"treatments\": [\"#12 ext Please specify extraction type: Surgical or Routine.\"]}]"
        },
        {
            "text": "input: #6 needs a mod comp filling"
        },
        {
            "text": "output: [{\"toothNumber\": \"#6\", \"treatments\": [\"3 Surface Anterior Composite Filling\"]}]"
        },
        {
            "text": "input: #4 mod comp"
        },
        {
            "text": "output: [{\"toothNumber\": \"#4\", \"treatments\": [\"3 Surface Posterior Composite Filling\"]}]"
        },
        {
            "text": "input: #14 MOD composite"
        },
        {
            "text": "output: [{\"toothNumber\": \"#14\", \"treatments\": [\"3 Surface Posterior Composite Filling\"]}]"
        },
        {
            "text": "input: #22-24 acc bridge"
        },
        {
            "text": "output: [{\"toothNumber\": \"#22\", \"treatments\": [\"ACC Retainer Crown\"]}, {\"toothNumber\": \"#23\", \"treatments\": [\"ACC Pontic\"]}, {\"toothNumber\": \"#24\", \"treatments\": [\"ACC Retainer Crown\"]}]"
        },
        {
            "text": "input: #12-15 pfm fpd"
        },
        {
            "text": "output: [{\"toothNumber\": \"#12\", \"treatments\": [\"PFM Retainer Crown\"]}, {\"toothNumber\": \"#13\", \"treatments\": [\"PFM Pontic\"]}, {\"toothNumber\": \"#14\", \"treatments\": [\"PFM Pontic\"]},\n{\"toothNumber\": \"#15\", \"treatments\": [\"PFM Retainer Crown\"]}]"
        },
        {
            "text": "input: #12-15 accfpd"
        },
        {
            "text": "output: [{\"toothNumber\": \"#12\", \"treatments\": [\"ACC Retainer Crown\"]}, {\"toothNumber\": \"#13\", \"treatments\": [\"ACC Pontic\"]}, {\"toothNumber\": \"#14\", \"treatments\": [\"ACC Pontic\"]},\n{\"toothNumber\": \"#15\", \"treatments\": [\"ACC Retainer Crown\"]}]"
        },
        {
            "text": "input: #4 DO com\n#15 MOD amalg\n#22 rct build up fmc retainer crown\n#23 pontic\n#24 fmc retainer crown"
        },
        {
            "text": "output: [{\"toothNumber\":\"#4\",\"treatments\":[\"2 Surface Posterior Composite Filling\"]},{\"toothNumber\":\"#15\",\"treatments\":[\"3 Surface Amalgam Filling\"]},{\"toothNumber\":\"#22\",\"treatments\":[\"Root Canal Anterior\",\"Build Up w/o Post\",\"FMC Retainer Crown\"]},{\"toothNumber\":\"#23\",\"treatments\":[\"FMC Pontic\"]},{\"toothNumber\":\"#24\",\"treatments\":[\"FMC Retainer Crown\"]}]"
        },
        {
            "text": "input: #22 rct build up pfm retainer crown\n#23 pontic\n#24 pfm retainer crown"
        },
        {
            "text": "output: [{\"toothNumber\": \"#22\", \"treatments\": [\"Root Canal Anterior\", \"Build Up w/o Post\", \"PFM Retainer Crown\"]}, {\"toothNumber\": \"#23\", \"treatments\": [\"PFM Pontic\"]}, {\"toothNumber\": \"#24\", \"treatments\": [\"PFM Retainer Crown\"]}]"
        },
        {
            "text": "input: #22 rct build up \n22-24 acc bridge"
        },
        {
            "text": "output: [{\"toothNumber\":\"#22\",\"treatments\":[\"Root Canal Anterior\",\"Build Up w/o Post\",\"ACC Retainer Crown\"]},{\"toothNumber\":\"#23\",\"treatments\":[\"ACC Pontic\"]},{\"toothNumber\":\"#24\",\"treatments\":[\"ACC Retainer Crown\"]}]"
        },
        {
            "text": "input: #7-9 implant bridge with acc"
        },
        {
            "text": "output: [{\"toothNumber\": \"#7\", \"treatments\": [\"Single Implant\", \"Implant ACC Retainer Crown\"]},\n{\"toothNumber\": \"#8\", \"treatments\": [\"ACC Pontic\"]}, {\"toothNumber\": \"#9\", \"treatments\": [\"Single Implant\", \"Implant ACC Retainer Crown\"]}]"
        },
        {
            "text": "input: #15 ext routine"
        },
        {
            "text": "output: [{\"toothNumber\": \"#15\", \"treatments\": [\"Routine Extraction\"]}]"
        },
        {
            "text": "input: #12-15 surgical extractions"
        },
        {
            "text": "output: [{\"toothNumber\":\"#12\",\"treatments\":[\"Surgical Extraction\"]},{\"toothNumber\":\"#13\",\"treatments\":[\"Surgical Extraction\"]},{\"toothNumber\":\"#14\",\"treatments\":[\"Surgical Extraction\"]},{\"toothNumber\":\"#15\",\"treatments\":[\"Surgical Extraction\"]}]"
        },
        {
            "text": "input: #3-5 single implants with pfm crowns"
        },
        {
            "text": "output: [{\"toothNumber\":\"#3\",\"treatments\":[\"Single Implant\",\"Implant Supported PFM Crown\"]},{\"toothNumber\":\"#4\",\"treatments\":[\"Single Implant\",\"Implant Supported PFM Crown\"]},{\"toothNumber\":\"#5\",\"treatments\":[\"Single Implant\",\"Implant Supported PFM Crown\"]}]"
        },
        {
            "text": "input: #13 pfm crown"
        },
        {
            "text": "output: [{\"toothNumber\": \"#13\", \"treatments\": [\"PFM Crown\"]}]"
        },
        {
            "text": "input: #5 rct buildup post with acc\n#6-8 pfm bridge\n#14 MOD comp"
        },
        {
            "text": "output: [{\"toothNumber\":\"#5\",\"treatments\":[\"Root Canal Pre-Molar\",\"Build Up w/ Post\",\"ACC Crown\"]},{\"toothNumber\":\"#6\",\"treatments\":[\"PFM Retainer Crown\"]},{\"toothNumber\":\"#7\",\"treatments\":[\"PFM Pontic\"]},{\"toothNumber\":\"#8\",\"treatments\":[\"PFM Retainer Crown\"]},{\"toothNumber\":\"#14\",\"treatments\":[\"3 Surface Posterior Composite Filling\"]}]"
        },
        {
            "text": "input: #3 needs an MOB-5 comp\n#6 rct, build up with post\n#6-11 pfm bridge\n#11 rct build up"
        },
        {
            "text": "output: [{\"toothNumber\":\"#3\",\"treatments\":[\"3 Surface Posterior Composite Filling\"]},{\"toothNumber\":\"#6\",\"treatments\":[\"Root Canal Anterior\",\"Build Up w/ Post\",\"PFM Retainer Crown\"]},{\"toothNumber\":\"#7\",\"treatments\":[\"PFM Pontic\"]},{\"toothNumber\":\"#8\",\"treatments\":[\"PFM Pontic\"]},{\"toothNumber\":\"#9\",\"treatments\":[\"PFM Pontic\"]},{\"toothNumber\":\"#10\",\"treatments\":[\"PFM Pontic\"]},{\"toothNumber\":\"#11\",\"treatments\":[\"Root Canal Anterior\",\"Build Up w/o Post\",\"PFM Retainer Crown\"]}]"
        },
        {
            "text": "input: #10 rct"
        },
        {
            "text": "output: [{\"toothNumber\":\"#10\",\"treatments\":[\"Root Canal Anterior\"]}]"
        },
        {
            "text": "input: "
        },
        {
            "text": "output: "
        }
    ];
