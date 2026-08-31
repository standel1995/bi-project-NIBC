/*
**
*This function calls mxPacs002CustomMatchingParams function.
* @param {DOMTree} Document - The message.
* @param {HashMap} map - The header values.
*/
function customMatching(exchange){

	var msgType;
    var inMsg = exchange.getIn();
    var map = inMsg.getHeaders();
    var Document = exchange.getIn().getBody(org.w3c.dom.Document.class);

    logger.info("In customMatching");

    msgType = getHeader(map,"PLCN_msgType");
    logger.info("customMatching: msgType = " + msgType)

    if(msgType == "pacs.002.001.10"){
    	mxPacs002CustomMatchingParams(Document, map, msgType);
    }
  	if(msgType == "pacs.004.001.09"){
    	mxPacs004CustomMatchingParams(Document, map, msgType);
    }
	if(msgType == "pain.002.001.10"){
    	mxPain002CustomMatchingParams(Document, map, msgType);
    }
	if (msgType == "camt.056.001.08") {
		sepaCamt056CustomMatchingParams(Document, map, msgType);
	}
	if (msgType == "camt.029.001.09") {
		sepaCamt029CustomMatchingParams(Document, map, msgType);
	}
  	if(msgType == "pacs.007.001.09"){
    	sepaPacs007CustomMatchingParams(Document, map, msgType);
    }
    logger.info("PLCN_validMessage = " + getHeader(map, "PLCN_validMessage"));
}

/**
* mx_pacs002CustomMatchingParams is for Custom Matching
* @param {DOMTree} Document - The message.
* @param {HashMap} map - The header values.
* @param {String} msgType - Message Type.
*/
function mxPacs002CustomMatchingParams(Document, map, msgType) {
	logger.info("inside customMatching");

	var institutionId;
	var mtchTransrefno;
	var mtchCurrency= "";
	var mtchMessageDirection;
	var priorityAmtNum;
	var txnMtchParam;
	var fileTransrefno;
	var msgDirection;
	var msgDirection1;
	var mtchAmount;
	var mtchAmount1;
	var fileOrgMsgId;
	var txnCustom2;
	txnCustom2 = "";

	setHeader(map,"txnMtchParam", "");
	setHeader(map,"MSG_FAMILY","TARGET2");
	setHeader(map,"MSGFAMILY","XML");

	mtchCurrency = "/Document/FIToFIPmtStsRpt/TxInfAndSts/OrgnlTxRef/IntrBkSttlmAmt/@Ccy";
	mtchCurrency = getValueFromPath(Document,mtchCurrency);
	logger.info("mtchCurrency: "+ mtchCurrency);
	setHeader(map, "PLCN_currency", mtchCurrency);
	logger.info("mtchCurrency: "+ mtchCurrency);

	txStsPath = "/Document/FIToFIPmtStsRpt/TxInfAndSts/TxSts";
	txStsVal = getValueFromPath(Document, txStsPath);
	if(txStsVal){
			txStsVal = txStsVal.trim();
	}
	setHeader(map, "PLCN_custom12", txStsVal);

	if(!priorityAmtNum){
		priorityAmtNum = getHeader(map, "PRIORITYAMOUNTNUM"); //""
	}
	institutionId = getHeader(map,"PLCN_institutionId"); //PLCNUSNY
	mtchTransrefno = getHeader(map,  "PLCN_transRefNo"); //""
	msgDirection = getHeader(map, "PLCN_msgDirection"); //I
	logger.info("msgDirection: " + msgDirection);

	
	txnMtchParam = institutionId + "|" + mtchTransrefno + "|" + priorityAmtNum + "|" + mtchCurrency + "|" + "I" + "|" + "M" + "|" + "|" + "|" + mtchTransrefno;
	//PLCNUSNY|||XXX|I|M|||

	if(isPatternPresent(msgType, "pacs.002.001.10")) {

		fileOrgMsgId = "/Document/FIToFIPmtStsRpt/TxInfAndSts/OrgnlGrpInf/OrgnlMsgId";
		fileOrgMsgId = getValueFromPath(Document,fileOrgMsgId);
		if(fileOrgMsgId){
			fileOrgMsgId = fileOrgMsgId.trim();
		}		
		logger.info("fileOrgMsgId: " + fileOrgMsgId);

		var transrefnoPath = "/Document/FIToFIPmtStsRpt/TxInfAndSts/OrgnlInstrId";
		var transrefno = getValueFromPath(Document,transrefnoPath);
		setHeader(map,"PLCN_Pacs002transrefNo", transrefno);

		//mtchTransrefno = "/Document/FIToFIPmtStsRpt/TxInfAndSts/OrgnlTxId"; 
		mtchTransrefno = "/Document/FIToFIPmtStsRpt/TxInfAndSts/OrgnlEndToEndId";
		mtchTransrefno = getValueFromPath(Document,mtchTransrefno);
		if(mtchTransrefno){
			mtchTransrefno = mtchTransrefno.trim();
		}
		setHeader(map, "PLCN_mtchTransrefno",mtchTransrefno);
		logger.info("mtchTransrefno: " + mtchTransrefno);
	
		mtchAmount = "/Document/FIToFIPmtStsRpt/TxInfAndSts/OrgnlTxRef/IntrBkSttlmAmt";
		mtchAmount = getValueFromPath(Document,mtchAmount);
		logger.info("mtchAmount: " + mtchAmount);
		priorityAmtNum = mtchAmount; 
		setHeader(map,"PLCN_priorityAmountNum", priorityAmtNum);

		if(mtchTransrefno && fileOrgMsgId){
			txnCustom2 = fileOrgMsgId + "¿" + mtchTransrefno;
			logger.info("txnCustom2: " + txnCustom2);
		}
		if(priorityAmtNum){
			setHeader(map,"PLCN_priorityAmount", priorityAmtNum);
			setHeader(map,"PLCN_priorityAmountNum", priorityAmtNum);
		}
		if(!(mtchCurrency)){
			mtchCurrency = "/Document/FIToFIPmtStsRpt/TxInfAndSts/OrgnlTxRef/IntrBkSttlmAmt/@Ccy";
			mtchCurrency = getValueFromPath(Document,mtchCurrency);
			logger.info("mtchCurrency: "+ mtchCurrency);
		}
		if(mtchTransrefno && fileOrgMsgId){
			setHeader(map, "PLCN_mtchTransrefno", mtchTransrefno);
			setHeader(map, "PLCN_fileOrgMsgId", fileOrgMsgId);
			//mtchTransrefno = fileOrgMsgId + "¿" + mtchTransrefno;
			
		}
		if(priorityAmtNum == null || mtchCurrency == null ){
			priorityAmtNum = "";
			mtchCurrency = "";
		}

		if(msgDirection == "O"){
			msgDirection = "I";
		}
		else if(msgDirection == "I"){
			msgDirection = "O";
		}		
		//txnMtchParam = "|" + mtchTransrefno + "|" + priorityAmtNum + "|" + mtchCurrency + "|" + msgDirection + "|M";
		txnMtchParam = "|" + priorityAmtNum + "|" + mtchCurrency + "|" + msgDirection + "|M";
		setHeader(map, "PLCN_txnMtchParam", txnMtchParam);
		logger.info("txnMtchParam: " + txnMtchParam);
	}
	setCurrentAuthLevel(Document, map);
	setHeader(map, "txnMtchParam",txnMtchParam); //CUSTOM7
	setHeader(map, "PLCN_custom2",txnCustom2); //CUSTOM2
	setHeader(map,"PLCN_processId", "TO-MATCH");

	return;
}

function mxPacs004CustomMatchingParams(Document, map, msgType) {
	logger.info("inside customMatching");

	var institutionId;
	var mtchTransrefno;
	var mtchCurrency= "";
	var mtchMessageDirection;
	var priorityAmtNum;
	var txnMtchParam;
	var fileTransrefno;
	var msgDirection;
	var msgDirection1;
	var mtchAmount;
	var mtchAmount1;
	var fileOrgMsgId;
	var txnCustom2;
	var msgFamily;
	txnCustom2 = "";

	setHeader(map,"txnMtchParam", "");
	setHeader(map,"MSGFAMILY","XML");

	msgFamily = getHeader(map, "PLCN_msgFamilyDB");
	logger.info("msgFamily: "+ msgFamily);

	mtchCurrency = "/Document/PmtRtr/TxInf/OrgnlIntrBkSttlmAmt/@Ccy";
	mtchCurrency = getValueFromPath(Document,mtchCurrency);
	logger.info("mtchCurrency: "+ mtchCurrency);
	setHeader(map, "PLCN_currency", mtchCurrency);
	logger.info("mtchCurrency: "+ mtchCurrency);

	/*var txnRsnCdPath = "/Document/PmtRtr/TxInf/RtrRsnInf/Rsn/Cd";
	var txnRsnCd = getValueFromPath(Document, txnRsnCdPath);
	logger.info("mxPacs004CustomMatchingParams: txnRsn Code = " + txnRsnCd);
	if(txnRsnCd){
		txnRsnCd = txnRsnCd.trim();
	}*/
	txnRsnCd = 'RETN';
	setHeader(map, "PLCN_custom12", txnRsnCd);
	setHeader(map, "PLCNAPI_custom12", txnRsnCd);

	if(!priorityAmtNum){
		priorityAmtNum = getHeader(map, "PLCN_priorityAmount"); //""
	}
	institutionId = getHeader(map,"PLCN_institutionId"); //PLCNUSNY
	mtchTransrefno = getHeader(map,  "PLCN_transRefNo"); //""
	msgDirection = getHeader(map, "PLCN_msgDirection"); //I
	logger.info("mxPacs004CustomMatchingParams: msgDirection = " + msgDirection);
	
	txnMtchParam = institutionId + "|" + mtchTransrefno + "|" + priorityAmtNum + "|" + mtchCurrency + "|" + "I" + "|" + "M" + "|" + "|" + "|" + mtchTransrefno;
	//PLCNUSNY|||XXX|I|M|||

	if(isPatternPresent(msgType, "pacs.004.001.09")) {

		fileOrgMsgId = "/Document/PmtRtr/TxInf/OrgnlGrpInf/OrgnlMsgId";
		fileOrgMsgId = getValueFromPath(Document,fileOrgMsgId);

		if(!fileOrgMsgId){
				fileOrgMsgId = "/Document/PmtRtr/OrgnlGrpInf/OrgnlMsgId";
				fileOrgMsgId = getValueFromPath(Document,fileOrgMsgId);
		}

		if(fileOrgMsgId){
			fileOrgMsgId = fileOrgMsgId.trim();
		}
		logger.info("fileOrgMsgId: " + fileOrgMsgId);

		var transrefnoPath = "/Document/PmtRtr/TxInf/OrgnlInstrId";
		var transrefno = getValueFromPath(Document,transrefnoPath);
		setHeader(map,"PLCN_Pacs004transrefNo", transrefno);

		mtchTransrefno = "/Document/PmtRtr/TxInf/OrgnlEndToEndId";
		mtchTransrefno = getValueFromPath(Document,mtchTransrefno);
		if(mtchTransrefno){
			mtchTransrefno = mtchTransrefno.trim();
		}
		setHeader(map, "PLCN_mtchTransrefno",mtchTransrefno);
		logger.info("mtchTransrefno: " + mtchTransrefno);
	
		mtchAmount = "/Document/PmtRtr/TxInf/OrgnlIntrBkSttlmAmt";
		mtchAmount = getValueFromPath(Document,mtchAmount);
		logger.info("mtchAmount: " + mtchAmount);
		priorityAmtNum = mtchAmount; 
		setHeader(map,"PLCN_priorityAmountNum", priorityAmtNum);


		var mtchTransrefnoPath = "/Document/PmtRtr/TxInf/OrgnlTxId";
		var mtchTransrefno1 = getValueFromPath(Document,mtchTransrefnoPath);
		logger.info("mtchTransrefno1: " + mtchTransrefno1);
		if(mtchTransrefno1){
			mtchTransrefno1 = mtchTransrefno1.trim();
		}

		if(mtchTransrefno && fileOrgMsgId){
			txnCustom2 = fileOrgMsgId + "¿" + mtchTransrefno;
			logger.info("txnCustom2: " + txnCustom2);
		}
		if(priorityAmtNum){
			setHeader(map,"PLCN_priorityAmount", priorityAmtNum);
			setHeader(map,"PLCN_priorityAmountNum", priorityAmtNum);
		}
		if(!(mtchCurrency)){
			mtchCurrency = "/Document/PmtRtr/TxInf/OrgnlIntrBkSttlmAmt/@Ccy";
			mtchCurrency = getValueFromPath(Document,mtchCurrency);
			logger.info("mtchCurrency: "+ mtchCurrency);
		}
		if(mtchTransrefno && fileOrgMsgId){
			setHeader(map, "PLCN_mtchTransrefno", mtchTransrefno);
			setHeader(map, "PLCN_fileOrgMsgId", fileOrgMsgId);
			//mtchTransrefno = fileOrgMsgId + "¿" + mtchTransrefno;
			
		}

		if(mtchTransrefno1 && fileOrgMsgId && msgFamily == "SEPA"){
			logger.info("INSIDE IF LOOP OF customMatching");
			setHeader(map, "PLCN_mtchTransrefno", mtchTransrefno1);
			setHeader(map, "PLCN_fileOrgMsgId", fileOrgMsgId);
			//mtchTransrefno = fileOrgMsgId + "¿" + mtchTransrefno;
			
		}

		if(priorityAmtNum == null || mtchCurrency == null ){
			priorityAmtNum = "";
			mtchCurrency = "";
		}

		if(msgDirection == "O"){
			logger.info("inside msgDirection O: " + msgDirection);
			msgDirection = "I";
		}else if(msgDirection == "I"){
			msgDirection = "O";
			logger.info("INSIDE msgDirection I: " + msgDirection);
		}		
		//txnMtchParam = "|" + mtchTransrefno + "|" + priorityAmtNum + "|" + mtchCurrency + "|" + msgDirection + "|M";
		txnMtchParam = "|" + priorityAmtNum + "|" + mtchCurrency + "|" + msgDirection + "|M";
		setHeader(map, "PLCN_txnMtchParam", txnMtchParam);
		logger.info("txnMtchParam: " + txnMtchParam);
	}
	setCurrentAuthLevel(Document, map);
	setHeader(map, "PLCN_txnMtchParam",txnMtchParam); //CUSTOM7
	setHeader(map, "PLCN_custom2",txnCustom2); //CUSTOM2
	setHeader(map,"PLCN_processId", "TO-MATCH");

	return;
}

function mxPain002CustomMatchingParams(Document, map, msgType) {
	logger.info("inside customMatching");

	var institutionId;
	var mtchTransrefno;
	var mtchCurrency= "";
	var mtchMessageDirection;
	var priorityAmtNum;
	var txnMtchParam;
	var fileTransrefno;
	var msgDirection;
	var msgDirection1;
	var mtchAmount;
	var mtchAmount1;
	var fileOrgMsgId;
	var txnCustom2;
	txnCustom2 = "";

	setHeader(map,"txnMtchParam", "");
	setHeader(map,"MSG_FAMILY","CBPR");
	setHeader(map,"MSGFAMILY","XML");

	mtchCurrency = "/Document/CstmrPmtStsRpt/OrgnlPmtInfAndSts/TxInfAndSts/OrgnlTxRef/IntrBkSttlmAmt/@Ccy";
	mtchCurrency = "EUR";//getValueFromPath(Document,mtchCurrency);
	logger.info("mtchCurrency: "+ mtchCurrency);
	setHeader(map, "PLCN_currency", mtchCurrency);
	logger.info("mtchCurrency: "+ mtchCurrency);

	msgMode = getHeader(map,"PLCN_msgModeIn");

	if(!msgMode){
		msgMode = getHeader(map,"PLCN_mode");
	}

	logger.info("msgMode: "+ msgMode);

	var txStsPath = "/Document/CstmrPmtStsRpt/OrgnlPmtInfAndSts/TxInfAndSts/TxSts";
	var txStsVal = getValueFromPath(Document, txStsPath);
	if(txStsVal){
		txStsVal = txStsVal.trim();
	}
	setHeader(map, "PLCN_custom12", txStsVal);

	if(!priorityAmtNum){
		priorityAmtNum = getHeader(map, "PRIORITYAMOUNTNUM"); //""
	}
	institutionId = getHeader(map,"PLCN_institutionId"); //PLCNUSNY
	mtchTransrefno = getHeader(map,  "PLCN_transRefNo"); //""
	msgDirection = getHeader(map, "PLCN_msgDirection"); //I
	
	txnMtchParam = institutionId + "|" + mtchTransrefno + "|" + priorityAmtNum + "|" + mtchCurrency + "|" + "I" + "|" + "M" + "|" + "|" + "|" + mtchTransrefno;
	//PLCNUSNY|||XXX|I|M|||

	if(isPatternPresent(msgType, "pain.002.001.10")) {

		fileOrgMsgId = "/Document/CstmrPmtStsRpt/OrgnlGrpInfAndSts/OrgnlMsgId";
		fileOrgMsgId = getValueFromPath(Document,fileOrgMsgId);
		if(fileOrgMsgId){
			fileOrgMsgId = fileOrgMsgId.trim();
		}
		logger.info("fileOrgMsgId: " + fileOrgMsgId);

		var transrefnoPath = "/Document/CstmrPmtStsRpt/OrgnlPmtInfAndSts/TxInfAndSts/OrgnlInstrId";
		var transrefno = getValueFromPath(Document,transrefnoPath);
		setHeader(map,"PLCN_pain002transrefNo", transrefno);

		mtchTransrefno = "/Document/CstmrPmtStsRpt/OrgnlPmtInfAndSts/TxInfAndSts/OrgnlEndToEndId";
		mtchTransrefno = getValueFromPath(Document,mtchTransrefno);
		if(mtchTransrefno){
			mtchTransrefno = mtchTransrefno.trim();
		}		
		setHeader(map, "PLCN_mtchTransrefno",mtchTransrefno);
		logger.info("mtchTransrefno: " + mtchTransrefno);
	
		mtchAmount = "/Document/CstmrPmtStsRpt/OrgnlPmtInfAndSts/TxInfAndSts/OrgnlTxRef/IntrBkSttlmAmt";
		mtchAmount = getValueFromPath(Document,mtchAmount);
		logger.info("mtchAmount: " + mtchAmount);
		priorityAmtNum = mtchAmount; 
		setHeader(map,"PLCN_priorityAmountNum", priorityAmtNum);

		if(mtchTransrefno && fileOrgMsgId){
			txnCustom2 = fileOrgMsgId + "¿" + mtchTransrefno;
			logger.info("txnCustom2: " + txnCustom2);
		}
		if(priorityAmtNum){
			setHeader(map,"PLCN_priorityAmount", priorityAmtNum);
			setHeader(map,"PLCN_priorityAmountNum", priorityAmtNum);
		}
		if(!(mtchCurrency)){
			mtchCurrency = "/Document/CstmrPmtStsRpt/OrgnlPmtInfAndSts/TxInfAndSts/OrgnlTxRef/IntrBkSttlmAmt/@Ccy";
			mtchCurrency = getValueFromPath(Document,mtchCurrency);
			logger.info("mtchCurrency: "+ mtchCurrency);
		}
		if(mtchTransrefno && fileOrgMsgId){
			setHeader(map, "PLCN_mtchTransrefno", mtchTransrefno);
			setHeader(map, "PLCN_fileOrgMsgId", fileOrgMsgId);
			//mtchTransrefno = fileOrgMsgId + "¿" + mtchTransrefno;
			
		}

		if(priorityAmtNum == null || mtchCurrency == null ){
			priorityAmtNum = "";
			mtchCurrency = "";
		}
		if(msgMode){
			if(isPatternPresent(msgMode, "MANUAL")){
					msgDirection = msgDirection;	
			}
			else{
					if(msgDirection == "O"){
						msgDirection = "I";
					}
					else if(msgDirection == "I"){
						msgDirection = "O";
					}			
			}			
		}
		
		//txnMtchParam = "|" + mtchTransrefno + "|" + priorityAmtNum + "|" + mtchCurrency + "|" + msgDirection + "|M";
		txnMtchParam = "|" + priorityAmtNum + "|" + mtchCurrency + "|" + msgDirection + "|M";
		setHeader(map, "PLCN_txnMtchParam", txnMtchParam);
		logger.info("txnMtchParam: " + txnMtchParam);
	}
	setCurrentAuthLevel(Document, map);
	setHeader(map, "txnMtchParam",txnMtchParam); //CUSTOM7
	setHeader(map, "PLCN_custom2",txnCustom2); //CUSTOM2
	setHeader(map,"PLCN_processId", "TO-MATCH");

	return;
}

function sepaCamt029CustomMatchingParams(Document, map, msgType) {
	logger.info("inside customMatching");

	var institutionId;
	var mtchTransrefno;
	var mtchCurrency= "";
	var mtchMessageDirection;
	var priorityAmtNum;
	var txnMtchParam;
	var fileTransrefno;
	var msgDirection;
	var msgDirection1;
	var mtchAmount;
	var mtchAmount1;
	var fileOrgMsgId;
	var txnCustom2;
	txnCustom2 = "";

	setHeader(map,"txnMtchParam", "");
	
	setHeader(map,"MSG_FAMILY","SEPA");
	setHeader(map,"MSGFAMILY","SEPA");
	

	mtchCurrency = "/Document/RsltnOfInvstgtn/CxlDtls/TxInfAndSts/RsltnRltdInf/IntrBkSttlmAmt/@Ccy";
	mtchCurrency = getValueFromPath(Document,mtchCurrency);
	logger.info("mtchCurrency: "+ mtchCurrency);
	setHeader(map, "PLCN_currency", mtchCurrency);
	logger.info("mtchCurrency: "+ mtchCurrency);

	var msgFamily = getHeader(map, "PLCN_msgFamilyDB");
	logger.info("msgFamily: "+ msgFamily);

	var txnRsnCdPath = "/Document/RsltnOfInvstgtn/CxlDtls/TxInfAndSts/CxlStsRsnInf/Rsn/Cd";
	var txnRsnCd = getValueFromPath(Document, txnRsnCdPath);
	logger.info("sepaCamt029CustomMatchingParams: txnRsn Code = " + txnRsnCd);
	if(txnRsnCd){
		txnRsnCd = txnRsnCd.trim();
	}
	setHeader(map, "PLCN_custom12", txnRsnCd);
	setHeader(map, "PLCNAPI_custom12", txnRsnCd);

	if(!priorityAmtNum){
		priorityAmtNum = getHeader(map, "PLCN_priorityAmount"); //""
	}
	institutionId = getHeader(map,"PLCN_institutionId"); //PLCNUSNY
	mtchTransrefno = getHeader(map, "PLCN_transRefNo"); //""
	msgDirection = getHeader(map, "PLCN_msgDirection"); //I
	
	txnMtchParam = institutionId + "|" + mtchTransrefno + "|" + priorityAmtNum + "|" + mtchCurrency + "|" + "I" + "|" + "M" + "|" + "|" + "|" + mtchTransrefno;
	//PLCNUSNY|||XXX|I|M|||

	if(isPatternPresent(msgType, "camt.029.001.09")) {

		fileOrgMsgId = "/Document/RsltnOfInvstgtn/CxlDtls/TxInfAndSts/OrgnlGrpInf/OrgnlMsgId";
		fileOrgMsgId = getValueFromPath(Document,fileOrgMsgId);
		if(fileOrgMsgId){
			fileOrgMsgId = fileOrgMsgId.trim();
		}
		logger.info("fileOrgMsgId: " + fileOrgMsgId);

		var transrefnoPath = "/Document/RsltnOfInvstgtn/CxlDtls/TxInfAndSts/OrgnlInstrId";
		var transrefno = getValueFromPath(Document,transrefnoPath);
		setHeader(map,"PLCN_Camt029transrefNo", transrefno);

		mtchTransrefno = "/Document/RsltnOfInvstgtn/CxlDtls/TxInfAndSts/OrgnlTxId";
		mtchTransrefno = getValueFromPath(Document,mtchTransrefno);
		if(mtchTransrefno){
			mtchTransrefno = mtchTransrefno.trim();
		}
		setHeader(map, "PLCN_mtchTransrefno",mtchTransrefno);
		logger.info("mtchTransrefno: " + mtchTransrefno);
	
		mtchAmount = "/Document/RsltnOfInvstgtn/CxlDtls/TxInfAndSts/RsltnRltdInf/IntrBkSttlmAmt";
		mtchAmount = getValueFromPath(Document,mtchAmount);
		logger.info("mtchAmount: " + mtchAmount);
		priorityAmtNum = mtchAmount; 
		setHeader(map,"PLCN_priorityAmountNum", priorityAmtNum);

		if(!priorityAmtNum){
			mtchAmount = "/Document/RsltnOfInvstgtn/CxlDtls/TxInfAndSts/OrgnlTxRef/IntrBkSttlmAmt";
			mtchAmount = getValueFromPath(Document,mtchAmount);
			logger.info("mtchAmount: " + mtchAmount);
			priorityAmtNum = mtchAmount; 
			setHeader(map,"PLCN_priorityAmountNum", priorityAmtNum);
		}
		if(mtchTransrefno && fileOrgMsgId){
			txnCustom2 = fileOrgMsgId + "¿" + mtchTransrefno;
			logger.info("txnCustom2: " + txnCustom2);
		}
		if(priorityAmtNum){
			setHeader(map,"PLCN_priorityAmount", priorityAmtNum);
			setHeader(map,"PLCN_priorityAmountNum", priorityAmtNum);
		}
		if(!mtchCurrency){
			mtchCurrency = "/Document/RsltnOfInvstgtn/CxlDtls/TxInfAndSts/RsltnRltdInf/IntrBkSttlmAmt/@Ccy";
			mtchCurrency = getValueFromPath(Document,mtchCurrency);
			logger.info("mtchCurrency: "+ mtchCurrency);
		}

		if(!mtchCurrency){
			mtchCurrency = "/Document/RsltnOfInvstgtn/CxlDtls/TxInfAndSts/OrgnlTxRef/IntrBkSttlmAmt/@Ccy";
			mtchCurrency = getValueFromPath(Document,mtchCurrency);
			logger.info("mtchCurrency: "+ mtchCurrency);
		}
		if(mtchTransrefno && fileOrgMsgId){
			setHeader(map, "PLCN_mtchTransrefno", mtchTransrefno);
			setHeader(map, "PLCN_fileOrgMsgId", fileOrgMsgId);
			//mtchTransrefno = fileOrgMsgId + "¿" + mtchTransrefno;
			
		}
		if(priorityAmtNum == null || mtchCurrency == null ){
			priorityAmtNum = "";
			mtchCurrency = "";
		}

		if(msgDirection == "O"){
			msgDirection = "I";
		}
		else if(msgDirection == "I"){
			msgDirection = "O";
		}		
		//txnMtchParam = "|" + mtchTransrefno + "|" + priorityAmtNum + "|" + mtchCurrency + "|" + msgDirection + "|M";
		txnMtchParam = "|" + priorityAmtNum + "|" + mtchCurrency + "|" + msgDirection + "|M";
		setHeader(map, "PLCN_txnMtchParam", txnMtchParam);
		logger.info("txnMtchParam: " + txnMtchParam);
	}
	setCurrentAuthLevel(Document, map);
	setHeader(map, "txnMtchParam",txnMtchParam); //CUSTOM7
	setHeader(map, "PLCN_custom2",txnCustom2); //CUSTOM2
	setHeader(map,"PLCN_processId", "TO-MATCH");

	return;
}

function sepaCamt056CustomMatchingParams(Document, map, msgType) {
	logger.info("inside customMatching");

	var institutionId;
	var UETRId;
	var CreDtTm;
	var instrId;
	var mtchTransrefno;
	var mtchCurrency= "";
	var mtchMessageDirection;
	var priorityAmtNum;
	var txnMtchParam;
	var fileTransrefno;
	var msgDirection;
	var msgDirection1;
	var mtchAmount;
	var mtchAmount1;
	var fileOrgMsgId;
	var txnCustom2;
	txnCustom2 = "";

	setHeader(map,"txnMtchParam", "");


	var msgMode = getHeader(map,"PLCN_msgModeIn");

	if(!msgMode){
		msgMode = getHeader(map,"PLCN_mode");
	}

	logger.info("msgMode: "+ msgMode);

	mtchCurrency = "/Document/FIToFIPmtCxlReq/Undrlyg/TxInf/OrgnlIntrBkSttlmAmt/@Ccy";
	mtchCurrency = getValueFromPath(Document,mtchCurrency);
	logger.info("mtchCurrency: "+ mtchCurrency);
	setHeader(map, "PLCN_currency", mtchCurrency);
	logger.info("mtchCurrency: "+ mtchCurrency);

	var msgFamily = getHeader(map, "PLCN_msgFamilyDB");
	logger.info("msgFamily: "+ msgFamily);

	var txnRsnCdPath = "/Document/FIToFIPmtCxlReq/Undrlyg/TxInf/CxlRsnInf/Rsn/Cd";
	var txnRsnCd = getValueFromPath(Document, txnRsnCdPath);
	logger.info("sepaCamt056CustomMatchingParams: txnRsn Code = " + txnRsnCd);
	if(txnRsnCd){
		txnRsnCd = txnRsnCd.trim();
	}
	setHeader(map, "PLCN_custom12", txnRsnCd);
	setHeader(map, "PLCNAPI_custom12", txnRsnCd);

	if(!priorityAmtNum){
		priorityAmtNum = getHeader(map, "PLCN_priorityAmount"); //""
	}
	institutionId = getHeader(map,"PLCN_institutionId"); //PLCNUSNY
	mtchTransrefno = getHeader(map,  "PLCN_transRefNo"); //""
	msgDirection = getHeader(map, "PLCN_msgDirection"); //I
	logger.info("sepaCamt056CustomMatchingParams: msgDirection: "+ msgDirection);
	
	// txnMtchParam = fileOrgMsgId  + "|" + CreDtTm +"|" + mtchTransrefno + "|"+ UETRId + "|"+ instrId + "|" + priorityAmtNum + "|" + mtchCurrency + "|" + "I" + "|" + "M" + "|" + "|" + "|" + mtchTransrefno;
	//PLCNUSNY|||XXX|I|M|||

	if(isPatternPresent(msgType, "camt.056.001.08")) {

		fileOrgMsgId = "/Document/FIToFIPmtCxlReq/Undrlyg/TxInf/OrgnlGrpInf/OrgnlMsgId";
		fileOrgMsgId = getValueFromPath(Document,fileOrgMsgId);
		if(fileOrgMsgId){
			fileOrgMsgId = fileOrgMsgId.trim();
		}
		setHeader(map, "PLCN_fileOrgMsgId", fileOrgMsgId);
		logger.info("fileOrgMsgId: " + fileOrgMsgId);

		instrId = "/Document/FIToFIPmtCxlReq/Undrlyg/TxInf/OrgnlInstrId";
		instrId = getValueFromPath(Document,instrId);
		// instrId = instrId.trim();
		setHeader(map, "PLCN_instrId",instrId);
		logger.info("instrID: " + instrId);

		UETRId = "/Document/FIToFIPmtCxlReq/Undrlyg/TxInf/OrgnlUETR";
	   UETRId = getValueFromPath(Document,UETRId);
	   logger.info("mtchUETR: "+UETRId);
	   setHeader(map, "PLCN_UETR", UETRId);
	   logger.info("mtchUETRId: "+ UETRId);

		   CreDtTm = "/Document/FIToFIPmtCxlReq/Assgnmt/CreDtTm";
		CreDtTm = getValueFromPath(Document,CreDtTm);
		logger.info("mtchCurrency: "+CreDtTm);
		setHeader(map, "PLCN_CreDtTm",CreDtTm);
		logger.info("mtchCreDtTm: "+ CreDtTm);


	    var transRefNoPath = "/Document/FIToFIPmtCxlReq/Undrlyg/TxInf/OrgnlInstrId";
		var transRefNoPathValue = getValueFromPath(Document, transRefNoPath);
		logger.info("transRefNoPathValue" + transRefNoPathValue);
		setHeader(map,"PLCN_Camt056transrefNo", transRefNoPathValue);
			

		// var transrefnoPath = "/Document/FIToFIPmtCxlReq/Undrlyg/TxInf/OrgnlInstrId";
		// var transrefno = getValueFromPath(Document,transrefnoPath);
		
		mtchTransrefno = "/Document/FIToFIPmtCxlReq/Undrlyg/TxInf/OrgnlTxId";
		mtchTransrefno = getValueFromPath(Document,mtchTransrefno);
		if(mtchTransrefno){
			mtchTransrefno = mtchTransrefno.trim();
		}
		setHeader(map, "PLCN_mtchTransrefno",mtchTransrefno);
		logger.info("mtchTransrefno: " + mtchTransrefno);
	
		mtchAmount = "/Document/FIToFIPmtCxlReq/Undrlyg/TxInf/OrgnlIntrBkSttlmAmt";
		mtchAmount = getValueFromPath(Document,mtchAmount);
		logger.info("mtchAmount: " + mtchAmount);
		priorityAmtNum = mtchAmount; 
		setHeader(map,"PLCN_priorityAmountNum", priorityAmtNum);

		if(mtchTransrefno && transRefNoPathValue){
			txnCustom2 = transRefNoPathValue + "¿" + mtchTransrefno;
			logger.info("txnCustom2: " + txnCustom2);
		}
		if(priorityAmtNum){
			setHeader(map,"PLCN_priorityAmount", priorityAmtNum);
			setHeader(map,"PLCN_priorityAmountNum", priorityAmtNum);
		}
		if(!(mtchCurrency)){
			mtchCurrency = "/Document/FIToFIPmtCxlReq/Undrlyg/TxInf/OrgnlIntrBkSttlmAmt/@Ccy";
			mtchCurrency = getValueFromPath(Document,mtchCurrency);
			logger.info("mtchCurrency: "+ mtchCurrency);
		}
		if(mtchTransrefno && fileOrgMsgId){
			setHeader(map, "PLCN_mtchTransrefno", mtchTransrefno);
			setHeader(map, "PLCN_fileOrgMsgId", fileOrgMsgId);
			//mtchTransrefno = fileOrgMsgId + "¿" + mtchTransrefno;
			
		}
		if(priorityAmtNum == null || mtchCurrency == null ){
			priorityAmtNum = "";
			mtchCurrency = "";
		}

	/*if(msgMode == "MQ"){
			logger.info("sepaCamt056CustomMatchingParams: inside direction loop ");
		if(msgDirection == "O"){
			logger.info("sepaCamt056CustomMatchingParams: inside direction O loop ");
			msgDirection = "I";
		}else if(msgDirection == "I"){
			logger.info("sepaCamt056CustomMatchingParams: inside direction I loop ");
			msgDirection = "O";
		}
		}*/	
    
  		/*if(msgDirection == "O"){
		 	msgDirection = "I";
		}else if(msgDirection == "I"){
			msgDirection = "O";
		}*/	
			
		//txnMtchParam = "|" + mtchTransrefno + "|" + priorityAmtNum + "|" + mtchCurrency + "|" + msgDirection + "|M";
		// txnMtchParam = fileOrgMsgId  + "|" + CreDtTm +"|" + mtchTransrefno + "|"+ UETRId + "|"+ instrId + "|" + priorityAmtNum + "|" + mtchCurrency + "|" + msgDirection + "|M";
		//txnMtchParam = "|"+mtchTransrefno+"¿"+transRefNoPathValue+"|"+mtchAmount+"|"+mtchCurrency+"|"+msgDirection+"|M";
		txnMtchParam = "|" + priorityAmtNum + "|" + mtchCurrency + "|" + msgDirection + "|M";
		setHeader(map, "PLCN_txnMtchParam", txnMtchParam);
		logger.info("txnMtchParam: " + txnMtchParam);
	}
	setCurrentAuthLevel(Document, map);
	setHeader(map, "txnMtchParam",txnMtchParam); //CUSTOM7
	setHeader(map, "PLCN_custom2",txnCustom2); //CUSTOM2
	setHeader(map,"PLCN_processId", "TO-MATCH");

	return;
}

function sepaPacs007CustomMatchingParams(Document, map, msgType) {
	logger.info("inside customMatching");

	var institutionId;
	var mtchTransrefno;
	var mtchCurrency= "";
	var mtchMessageDirection;
	var priorityAmtNum;
	var txnMtchParam;
	var fileTransrefno;
	var msgDirection;
	var msgDirection1;
	var mtchAmount;
	var mtchAmount1;
	var fileOrgMsgId;
	var txnCustom2;
	var msgFamily;
	txnCustom2 = "";

	setHeader(map,"txnMtchParam", "");
	setHeader(map,"MSGFAMILY","XML");

	msgFamily = getHeader(map, "PLCN_msgFamilyDB");
	logger.info("msgFamily: "+ msgFamily);

	mtchCurrency = "/Document/FIToFIPmtRvsl/TxInf/OrgnlIntrBkSttlmAmt/@Ccy";
	mtchCurrency = getValueFromPath(Document,mtchCurrency);
	setHeader(map, "PLCN_currency", mtchCurrency);
	logger.info("sepaPacs007CustomMatchingParams: mtchCurrency =  "+ mtchCurrency);

/* 	var rsnCdPath = "/Document/FIToFIPmtRvsl/TxInf/RvslRsnInf/Rsn/Cd";
	rsnCd = getValueFromPath(Document, rsnCdPath);
	if(rsnCd){
		rsnCd = rsnCd.trim();
	}*/

	txStsVal = 'RVRS';
	setHeader(map, "PLCN_custom12", txStsVal);
	setHeader(map, "PLCNAPI_custom12", txStsVal); 

	if(!priorityAmtNum){
		priorityAmtNum = getHeader(map, "PLCN_priorityAmount"); //""
	}
	institutionId = getHeader(map,"PLCN_institutionId"); //PLCNUSNY
	mtchTransrefno = getHeader(map,  "PLCN_transRefNo"); //""
	msgDirection = getHeader(map, "PLCN_msgDirection"); //I
	logger.info("sepaPacs007CustomMatchingParams: msgDirection = " + msgDirection);
	
	txnMtchParam = institutionId + "|" + mtchTransrefno + "|" + priorityAmtNum + "|" + mtchCurrency + "|" + "I" + "|" + "M" + "|" + "|" + "|" + mtchTransrefno;
	//PLCNUSNY|||XXX|I|M|||

	if(isPatternPresent(msgType, "pacs.007.001.09")) {

		fileOrgMsgId = "/Document/FIToFIPmtRvsl/TxInf/OrgnlGrpInf/OrgnlMsgId";
		fileOrgMsgId = getValueFromPath(Document,fileOrgMsgId);

		if(!fileOrgMsgId){
				fileOrgMsgId = "/Document/FIToFIPmtRvsl/OrgnlGrpInf/OrgnlMsgId";
				fileOrgMsgId = getValueFromPath(Document,fileOrgMsgId);
		}

		if(fileOrgMsgId){
			fileOrgMsgId = fileOrgMsgId.trim();
		}
		logger.info("fileOrgMsgId: " + fileOrgMsgId);

		var transrefnoPath = "/Document/FIToFIPmtRvsl/TxInf/OrgnlInstrId";
		var transrefno = getValueFromPath(Document,transrefnoPath);
		setHeader(map,"PLCN_Pacs007transrefNo", transrefno);

		mtchTransrefno = "/Document/FIToFIPmtRvsl/TxInf/OrgnlTxId";
		mtchTransrefno = getValueFromPath(Document,mtchTransrefno);
		if(mtchTransrefno){
			mtchTransrefno = mtchTransrefno.trim();
		}
		setHeader(map, "PLCN_mtchTransrefno",mtchTransrefno);
		logger.info("sepaPacs007CustomMatchingParams: mtchTransrefno = " + mtchTransrefno);
	
		mtchAmount = "/Document/FIToFIPmtRvsl/TxInf/OrgnlIntrBkSttlmAmt";
		mtchAmount = getValueFromPath(Document,mtchAmount);
		logger.info("mtchAmount: " + mtchAmount);
		priorityAmtNum = mtchAmount; 
		setHeader(map,"PLCN_priorityAmountNum", priorityAmtNum);

		if(priorityAmtNum){
			setHeader(map,"PLCN_priorityAmount", priorityAmtNum);
			setHeader(map,"PLCN_priorityAmountNum", priorityAmtNum);
		}
		if(!(mtchCurrency)){
			mtchCurrency = "/Document/FIToFIPmtRvsl/TxInf/OrgnlIntrBkSttlmAmt/@Ccy";
			mtchCurrency = getValueFromPath(Document,mtchCurrency);
			logger.info("sepaPacs007CustomMatchingParams: mtchCurrency: "+ mtchCurrency);
		}
		if(mtchTransrefno && fileOrgMsgId){
			setHeader(map, "PLCN_mtchTransrefno", mtchTransrefno);
			setHeader(map, "PLCN_fileOrgMsgId", fileOrgMsgId);
			//mtchTransrefno = fileOrgMsgId + "¿" + mtchTransrefno;
			
		}


		if(priorityAmtNum == null || mtchCurrency == null ){
			priorityAmtNum = "";
			mtchCurrency = "";
		}

	/*if(msgDirection == "O"){
			logger.info("inside msgDirection O: " + msgDirection);
			msgDirection = "I";
		}else if(msgDirection == "I"){
			msgDirection = "O";
			logger.info("inside msgDirection I: " + msgDirection);
		}	*/	
		//txnMtchParam = "|" + mtchTransrefno + "|" + priorityAmtNum + "|" + mtchCurrency + "|" + msgDirection + "|M";
		txnMtchParam = "|" + priorityAmtNum + "|" + mtchCurrency + "|" + msgDirection + "|M";
		setHeader(map, "PLCN_txnMtchParam", txnMtchParam);
		logger.info("txnMtchParam: " + txnMtchParam);
	}
	setCurrentAuthLevel(Document, map);
	setHeader(map, "PLCN_txnMtchParam",txnMtchParam); //CUSTOM7
	setHeader(map,"PLCN_processId", "TO-MATCH");

	return;
}

function setCurrentAuthLevel(Document,map) {
	
	var institutionId = getHeader(map, "PLCN_institutionId");
	logger.info("setSchedulingHeader: institutionId = " + institutionId);

	var authLevelKey = institutionId + "." + "INSTITUTION_DETAILS.AUTHENTICATION_LEVEL.STAGES.MATCHING" + "." + "STAGE_ACCESS_CONTROL";
    logger.info("setCurrentAuthLevel: authLevelKey = " + authLevelKey);

    var authLevelValue = memTblGetTableValue(map, "INST_PARAM", authLevelKey);
    logger.info("setCurrentAuthLevel: authLevelValue = " + authLevelValue);

    if(!authLevelValue) {
        authLevelKey = institutionId + "." + "INSTITUTION_DETAILS.AUTHENTICATION_LEVEL" + "." + "INSTITUTION_ACCESS_CONTROL";
        logger.info("setCurrentAuthLevel: authLevelKey = " + authLevelKey);

        authLevelValue = memTblGetTableValue(map, "INST_PARAM", authLevelKey);
        logger.info("setCurrentAuthLevel: authLevelValue = " + authLevelValue);      
    }

    authLevelValue = "MTCH=" + textToNum(authLevelValue);
    logger.info("setCurrentAuthLevel: authLevelValue = " + authLevelValue);

    setHeader(map, "PLCN_currentAuthLevel", authLevelValue);
    setHeader(map, "PLCNAPI_currentAuthLevel", authLevelValue);
    setHeader(map, "PLCN_currentAuthLevel", authLevelValue);
    setHeader(map, "PLCNAPI_processingStage", "MTCH");
    setHeader(map, "PLCNAPI_queueAudit", "TMPTXVWQ");
}