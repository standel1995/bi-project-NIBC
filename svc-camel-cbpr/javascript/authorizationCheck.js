function checkAuthorization(exchange){
    var inMsg;
    var map;
    var PLCN_prevQueueId;
    var custom13;
    var institutionId;
    var key;
    var value;
    var key1;
    var value1;
    var productCode;
    var msgDirection;
    var authCheckFlag;
    var authKey;
    var authConfigAmount;
    var channelIdKey;
    var PLCN_msgType;
    var PLCN_sourcechannelId;
    var priorityAmount;
    var PLCN_authReq;

    logger.info("In checkAuthorization");

    inMsg = exchange.getIn();
    map = inMsg.getHeaders();

    priorityAmount = getHeader(map,"PLCN_priorityAmount");
    logger.info("checkAuthorization: priorityAmount = " + priorityAmount);

    msgDirection = getHeader(map, "PLCN_msgDirection");
    logger.info("checkAuthorization: msgDirection = " + msgDirection);

    PLCN_prevQueueId = getHeader(map, "PLCN_prevQueueId");
    logger.info("checkAuthorization: PLCN_prevQueueId = " + PLCN_prevQueueId);

    PLCN_msgType = getHeader(map,"PLCN_msgType");
    logger.info("checkAuthorization: PLCN_msgType = " + PLCN_msgType);

    PLCN_sourcechannelId = getHeader(map,"PLCN_sourceChannelId");
    logger.info("checkAuthorization: PLCN_sourcechannelId = " + PLCN_sourcechannelId);

    channelIdKey = memTblGetTableValue(map,"NIBC_CHNL_KEY_MAP",PLCN_sourcechannelId);
    logger.info("checkAuthorization: channelIdKey = " + channelIdKey);

    var authLevelKey = institutionId + "." + "INSTITUTION_DETAILS.AUTHENTICATION_LEVEL.STAGES.AUTHORIZATION" + "." + "STAGE_ACCESS_CONTROL";
    logger.info("checkAuthorization: authLevelKey = " + authLevelKey);

    var authLevelValue = memTblGetTableValue(map, "INST_PARAM", authLevelKey);
    logger.info("checkAuthorization: authLevelValue = " + authLevelValue);

    if(!authLevelValue) {
        authLevelKey = institutionId + "." + "INSTITUTION_DETAILS.AUTHENTICATION_LEVEL" + "." + "INSTITUTION_ACCESS_CONTROL";
        logger.info("checkAuthorization: authLevelKey = " + authLevelKey);

        authLevelValue = memTblGetTableValue(map, "INST_PARAM", authLevelKey);
        logger.info("checkAuthorization: authLevelValue = " + authLevelValue);      
    }

    authLevelValue = "AUTH=" + textToNum(authLevelValue);
    logger.info("checkAuthorization: authLevelValue = " + authLevelValue);

    if(PLCN_prevQueueId == "MXREPRQ" && PLCN_msgType != "camt.057.001.06") {
    	setHeader(map, "PLCN_authReq", "true");
    	logger.info("checkAuthorization: PLCN_authReq = " + getHeader(map, "PLCN_authReq"));
        setHeader(map, "status", "authorization required");
        setHeader(map, "PLCN_displayFlag", "Y");
        setHeader(map, "PLCN_processingStage", "AUTH");
        setHeader(map, "PLCN_currentAuthLevel", authLevelValue);
        setHeader(map, "PLCN_queue", "MXMSGAH");
    	return;	
    }

    authKey = "Amount_Cap_" + channelIdKey + "_" + PLCN_msgType;
    authKey = authKey.toUpperCase();
    logger.info("checkAuthorization: authKey = " + authKey);
    
    //authConfigKey = "Amount_Cap_" + PLCN_sourcechannelId + "_" + PLCN_msgType;
    //authConfigKey = authConfigKey.toUpperCase();
    //logger.info("checkAuthorization: authConfigKey = " + authConfigKey);
    
    authCheckFlag = memTblGetTableValue(map, "APPLY_AUTH_CAP_MAP", authKey);
    logger.info("checkAuthorization: authCheckFlag = " + authCheckFlag);

    authConfigAmount = memTblGetTableValue(map, "AMOUNT_CAP_TBL_MAP", authKey);
    logger.info("checkAuthorization: authConfigAmount = " + authConfigAmount); 

    institutionId = getHeader(map, "PLCN_institutionId");
    logger.info("checkAuthorization: institutionId = " + institutionId);

    productCode = getHeader(map, "PLCN_productCode");
    logger.info("checkAuthorization: productCode = " + productCode);
    logger.info("checkAuthorization: typeof productCode = " + typeof productCode);

    var productCodeLength = productCode.length;
    logger.info("checkAuthorization: productCodeLength = " + productCodeLength);
   
    key1 = institutionId + "."+ "PROCESSING_STAGES.AUTHORIZE" + "." + "AMOUNT_CAP" + "." + "BASED_ON_SWIFT_PRODUCT_CODE";
    logger.info("checkAuthorization: key1 = " + key1);

    value1 = memTblGetTableValue(map, "INST_PARAM", key1);
    logger.info("checkAuthorization: value1 = " + value1);

    key = institutionId + "."+ "PROCESSING_STAGES.AUTHORIZE" + "." + "PRODUCTS";
    logger.info("checkAuthorization: key = " + key);

    value = memTblGetTableValue(map, "INST_PARAM", key);
    logger.info("checkAuthorization: value = " + value);
   
    if(productCode != null) {
        if(isPatternPresent(value, productCode)) {
            setHeader(map, "PLCN_authReq", true);
            setHeader(map, "PLCN_queue", "MXMSGAH");
            setHeader(map, "PLCN_validFlag", "false");
            setHeader(map, "status", "authorization required");
            setHeader(map, "PLCN_displayFlag", "Y");
            setHeader(map, "PLCN_processingStage", "AUTH");
            setHeader(map, "PLCN_currentAuthLevel", authLevelValue);
        }else {
            setHeader(map, "PLCN_authReq", false);
            setHeader(map, "PLCN_queue", "SCHIN");
            setHeader(map, "PLCN_validFlag", "true");
            setHeader(map, "status", "no authorization required");
        }
    }else {
        setHeader(map, "PLCN_authReq", false);
        setHeader(map, "PLCN_queue", "SCHIN");
        setHeader(map, "PLCN_validFlag", "true");
        setHeader(map, "status", "no authorization required");
    }

    PLCN_authReq = getHeader(map,"PLCN_authReq");
    logger.info("checkAuthorization: PLCN_authReq = " + PLCN_authReq);
    logger.info("checkAuthorization: Data type PLCN_authReq = " + typeof PLCN_authReq)

    if((PLCN_msgType == "pacs.008.001.08" || PLCN_msgType == "pacs.009.001.08" || PLCN_msgType == "pacs.004.001.09" || PLCN_msgType == "camt.057.001.06") && (PLCN_authReq == false)) { 
        logger.info("checkAuthorization: PLCN_authReq flag is false");
        if(authCheckFlag == "YES") {
            logger.info("checkAuthorization:Authorization check flag value found YES");
            if(productCode != null) {
                logger.info("checkAuthorization:productCode is not null");
                if(isPatternPresent(value1, productCode)) {
                    logger.info("checkAuthorization:productCode found..");
                        if(priorityAmount > authConfigAmount) {
                            logger.info("checkAuthorization:priorityAmount amount is greater than configured amount.");
                            setHeader(map, "PLCN_authReq", true);
                            setHeader(map, "PLCN_queue", "MXMSGAH");
                            setHeader(map, "PLCN_validFlag", "false");
                            setHeader(map, "status", "authorization required");
                            setHeader(map, "PLCN_displayFlag", "Y");
                            setHeader(map, "PLCN_processingStage", "AUTH");
                            setHeader(map, "PLCN_currentAuthLevel", authLevelValue);
                        }else {
                            logger.info("checkAuthorization:priorityAmount amount is greater than configured amount.");
                            setHeader(map, "PLCN_authReq", false);
                            setHeader(map, "PLCN_queue", "SCHIN");
                            setHeader(map, "PLCN_validFlag", "true");
                            setHeader(map, "status", "no authorization required");
                        }
                    } else {
                        logger.info("checkAuthorization:Product code not found");
                        setHeader(map, "PLCN_authReq", false);
                        setHeader(map, "PLCN_queue", "SCHIN");
                        setHeader(map, "PLCN_validFlag", "true");
                        setHeader(map, "status", "no authorization required");
                    }
                }else {
                        logger.info("checkAuthorization:productCode is equal to null");
                        setHeader(map, "PLCN_authReq", false);
                        setHeader(map, "PLCN_queue", "SCHIN");
                        setHeader(map, "PLCN_validFlag", "true");
                        setHeader(map, "status", "no authorization required");
                   }
             }else {
                    logger.info("checkAuthorization:Authorization check flag value found NO");
                    setHeader(map, "PLCN_authReq", false);
                    setHeader(map, "PLCN_queue", "SCHIN");
                    setHeader(map, "PLCN_validFlag", "true");
                    setHeader(map, "status", "no authorization required");
               }  
        }else {
             logger.info("checkAuthorization:Message is already Authorized.");
    }
    
    logger.info("checkAuthorization: PLCN_authReq = " + getHeader(map,"PLCN_authReq"));

    var authStatus = getHeader(map, "status");
    logger.info("checkAuthorization: authStatus = " + authStatus);

    if(authStatus == "authorization required") {
        logger.info("checkAuthorization: authStatus = " + authStatus);
        setHeader(map, "PLCN_custom13", "AUTH=Y");
    }else if(authStatus == "no authorization required") {
        logger.info("checkAuthorization: authStatus = " + authStatus);
        setHeader(map, "PLCN_custom13", "AUTH=N");       
    }
}