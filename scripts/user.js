//first for generic js functions - think of this as a demo - find this function also in jOmnis
// i want mid/left/right functions for strings
//to call using omnis style right(MyChar,5)
right = function(pChar,n) {return pChar.substring(pChar.length-n,pChar.length);};
left = function(pChar,n) {return pChar.substring(0,n);};
mid = function(pChar,pStart,pLength) {return pChar.substring(pStart,pStart+pLength);};
//to call javastyle MyChar.right(5)
String.prototype.left = function(n) {return this.substring(0, n);};
String.prototype.right= function(n) {return this.substring(this.length-n,this.length);};
String.prototype.mid= function(pStart,pLength) {return this.substring(pStart,pStart+pLength);};

function setDefaultIfEmpty(pListName,pCol,pForm=$cform)

//Marquee_filterArgs is used by the marquee control events - basically it strigifys subobjects contained in parameter args
function Marquee_filterArgs(args) {
    var filteredArgs = {};
    var keys = Object.keys(args);
    for (var i = 0; i < keys.length; i++) {
        var key = keys[i];
        var value = args[key];
        if (value instanceof Object && value.constructor === Object) {
            filteredArgs[key] = JSON.stringify(value);
        } else {
            filteredArgs[key] = value;
        }
    }
    return filteredArgs;
}
//loads css files specified in pHeaderfiles (comma separated) if not already loaded in header
function provide_headerfiles(pHeaderfiles) {
    gLinkConcat="";
    
    $(document.styleSheets)
    .filter(function (i,elem) {return ((this.href)&&(this.href.length>=1))})
    .each(function (i,elem) {gLinkConcat=gLinkConcat+','+elem.href.substring(elem.href.lastIndexOf('/')+1)})
    ;
    gLinkConcat+=',';
    
    $(document.scripts)
    // once available: add a filter that checks if JS has run
    .each(function (i,elem) {gLinkConcat+=','+elem.src.substring(elem.src.lastIndexOf('/')+1)})
    ;
    gLinkConcat+=',';

    var MyLinksNeeded = pHeaderfiles;
    // If len(MyLinksNeeded)>=1
    if (jOmnis.fn.len(MyLinksNeeded) >= 1) {
        var MyLinksArray=MyLinksNeeded.split(',')
        MyLinksArray.every( function (elem,i) { 
            if (gLinkConcat.indexOf(elem.substring(elem.lastIndexOf('/')+1)||elem)==-1) {
                console.log('loading linked file needed but not loaded :'+elem); 
                load_headerfile(elem)
            }
            return true;
        }
        );
    }
};
//loads css files specified in pHeaderfiles (comma separated) - don't rely on JS files to load before you do something else
function load_headerfile(pURL,pFileType) {
    var MyURL = pURL;
    var MyFileType = pFileType;
    if (jOmnis.fn.isclear(MyFileType)) {
        MyFileType = jOmnis.fn.right(MyURL, 4);
        var MyPos = jOmnis.fn.pos('.', MyFileType);
        if (MyPos >= 1)    { MyFileType = jOmnis.fn.mid(MyFileType, MyPos+1, 4);}
    }


    switch (MyFileType)
    {
        case 'js':
        $.getScript(MyURL);
        // JavaScript: var fileref=document.createElement('script')
        // JavaScript: fileref.setAttribute("type","text/javascript")
        // JavaScript: fileref.setAttribute("src", MyURL)
        // JavaScript: document.getElementsByTagName("head")[0].appendChild(fileref)
        break;

        case 'css':
        var fileref=document.createElement("link")
        fileref.setAttribute("rel", "stylesheet")
        fileref.setAttribute("type", "text/css")
        fileref.setAttribute("href", MyURL)
        document.getElementsByTagName("head")[0].appendChild(fileref)
        break;

        default:
        break;
    }
};    


function lstData4Sync(pLIST) {
    var MyListData= [];
    var MyRowData= [];    
    pLIST.lstData.forEach( function (dataRow, lineNr) {
        pLIST.lstDef.forEach ( function(defRow, colNr) {
		  if (typeof pLIST.lstData[lineNr][colNr] == "object") {MyRowData[defRow[0]]=lstData2lstDataObj(pLIST.lstData[lineNr][colNr]);}
		  else {MyRowData.push(pLIST.lstData[lineNr][colNr]);};});
        MyListData[lineNr]=MyRowData;
	    MyRowData=[];
    });
return MyListData;
};


//list related
function lstData2lstDataObj(pLIST) {
    var MyData= [];
pLIST.lstData.forEach(
    function (currentValue, index1, array) {
        MyData= (typeof MyData=="undefined") ? []:MyData;
        MyData[index1]= pLIST.lstDef.reduce (
            function(result, item, index2, array) {
                result[item[0]]=pLIST.lstData[index1][index2];
                return result;
            },
            {}
        );
    }
);
return MyData;
};

function colData(pCol,pList) {
    MyColNr = (isNaN(pCol)) ? pList.lstDef.map(function(value) { return value[0]; }).indexOf(pCol):pCol
    return eval("pList.lstData.map(function(value) { return value["+MyColNr+"]; })");
}

//form related
//restores data saved with $backupFormData if necessary
//does not support multiple instances of a form yet
function restoreFormData(pDoOpacityCheck=true,pForm=$cform) {
var MyCheckOK=true;
if (pDoOpacityCheck) {MyCheckOK=((pForm.inst.elem.style.opacity||1)<1);}
if (MyCheckOK) 
    {
    // ####TODO: add loop through all forms of all jOmnis.omnisInsts    
    pForm.inst.elem.style.opacity=1;
    //console.log("2trying to recover data");
    MyBackup=JSON.parse(localStorage.getItem('_BACKUP_'+pForm.mMethodNamePrefix))

    if (jOmnis.fn.not(jOmnis.fn.isclear(MyBackup))) 
        {
        $.each(pForm.ivars, function (ivarName,ivarNum) 
            {
            var ivarValue=MyBackup[ivarNum-1]
            var ivarType=pForm.instanceVars.lstDef[ivarNum-1][1]
            //list or row
            if (ivarType =='29')      
                {
                if (typeof(ivarValue)=='undefined') { pForm.set(ivarName,)}
                else {
                     pForm.get(ivarName).lstData=ivarValue.lstData;
                     pForm.set(ivarName,jOmnis.copyValue(pForm.get(ivarName)));
                     }
                }
            //other field types
            else {pForm.set(ivarName,jOmnis.copyValue(ivarValue))}
            }
            );
        }
    }
};
//tests whether an object on a form or a form (pObjNr==0) has a method
function $methodExists(pObjNr=0,pMethodName,pForm=$cform) {
    //console.log(pObjNr+'/'+pMethodName+'/'+pForm.mMethodNamePrefix);
	if (pObjNr==0) {var MyCall='typeof (pForm.'+pForm.mMethodNamePrefix+pMethodName+'_'+pForm.number+')=="function"';}
	else {var MyCall='typeof (pForm.$objs().mObjArray.find( o => o.objNumber=='+pObjNr+').'+pForm.mMethodNamePrefix+pObjNr+'_'+pMethodName+'_'+pForm.number+')=="function"';}
	//console.log(MyCall+'='+eval(MyCall))
    return eval(MyCall)
}

//omnis functions
//omnis_raw_list functions added
omnis_raw_list.prototype.$copy2LocalList = function  (pLocalListName) {
var MyList = jOmnis.copyValue(this);
MyList.lstName= function () {return(pLocalListName);};
return MyList
};
//$colData returns one column of the list as an array. single parameter is the name of number of the list column to return
omnis_raw_list.prototype.$colData = function (pCol) {return colData(pCol,this)};
//$lstDataObj returns the lists data as an object including the names
omnis_raw_list.prototype.$lstDataObj = function () {return lstData2lstDataObj(this)};
//omnis_form.prototype 
//functions modified
//automatic restoreFormData added
//$form.$objs.$sendall $init added
omnis_form.prototype.prepareForScripts = function() {

    function a(a) {
        var b;
        a.subFormObj && a.subFormObj.userInfo ? (b = jOmnis.parseCommaSeparatedList(a.subFormObj.userInfo), b = ["$init", eDoMethodFlags.clientOnly | eDoMethodFlags.noLog].concat(b), b = a.callMethodEx.apply(a, b)) : b = a.callMethodEx("$init", eDoMethodFlags.clientOnly | eDoMethodFlags.noLog);
        "string" != typeof b || jOmnis.beforeUnload || (jOmnis.beforeUnload = b, window.onbeforeunload = gBeforeUnload);
        if (a.scriptNotify) {
            for (b = 0; b < a.scriptNotify.length; ++b) a.scriptNotify[b].scriptAvail();
            a.scriptNotify = null
        }
    }
    null == this.mMethodNamePrefix && (this.mMethodNamePrefix = this.omnislib + "_" + this.omnisclass + "_", this.mMethodNamePrefix = this.mMethodNamePrefix.replace(/[^a-zA-Z0-9_$]/g, "_").toLowerCase());
    this[this.mMethodNamePrefix + "__setivars"]();
    if (this.inst.inRequest || 0 != this.loadingSubform) var b = this,
        c = setInterval(function() {
            b.inst.inRequest || 0 != b.loadingSubform || (clearInterval(c), a(b))
        }, 10);
    else a(this);
    //modification start - restore Form data by default works only if opacity check is passed - maybe better check only if asked for
    this.callMethodEx('$restoreFormData');
    //call method $init for all subobjects, that have this method - Problem: $obj.$init might need $form.$init to allready have finished
    this.$objs().$sendall(function ($ref) {if ($methodExists($ref.objNumber,'$init',$ref.form)) {$ref.callMethod('$init')}})
    $cform=this
    //build notation
    this.$registerInNotation(this)
    //modification end
};
//functions added
//adds a redraw function calling all subojects $init and registered widgets (UPPERCASE Widget Names required)
omnis_form.prototype.$redraw = function() {
    var MyForm=this
	if ($methodExists(0,'$redraw_',this)) {this.callMethod('$redraw_')};	 
     $(Object
     .keys(this.$objs)
     .filter( function (elem,i,array) {var MyRegEx=/^[A-Z_1-9]+$/; return MyRegEx.test(elem);}) 
      )
     .each( function (i,elem) {eval('MyForm.$objs.'+elem+'.$redraw()')})
     //call a redraw of all objs of the form, that have a redraw method
     this.$objs().$sendall(function ($ref) {if ($methodExists($ref.objNumber,'$redraw',$ref.form)) {$ref.callMethod('$redraw')}})

}

$fullname=function (pForm=$cform){
    var MyName = "$root.$iwindows." + pForm.omnisclass + "_" + pForm.number.toString()
	return MyName
}


//add a more familiar notation tree
omnis_form.prototype.$registerInNotation=function (pForm=$cform){

  $root = typeof $root !== 'undefined' ? $root : {};
  $root.$iwindows = typeof $root.$iwindows !== 'undefined' ? $root.$iwindows : {};
  var NotASubwindow = typeof pForm.parentForm=="undefined"
  var MyName = pForm.omnisclass
  var MyType = left(MyName,2)
  if (MyType=='rf') {
    //add number as unique identifier for forms - they might have several instances
    MyName +='_' + pForm.number.toString()
    $root.$iwindows[MyName] = pForm;
  }
  else if (MyType=='ro') {
    $root.$iremoteobjs = typeof $root.$iremoteobjs !== 'undefined' ? $root.$iremoteobjs : {};
    if (NotASubwindow) {
      //register for public use - allow only one instance of this form to be public for now 
      //- else need to add the name as unique identifier
      $root.$iremoteobjs[MyName] = pForm;
      MyHideMe=true
    }
    else {
      //register within Form in simplified notation - available only for this form and only one instance
      pForm.parentForm[MyName] = pForm;
    }
  }
  else if (MyType=='db') {
      //register for public use - allow only one instance of this form to be public for now
      //- else need to add the name as unique identifier
    $root.$iclientdbs = typeof $root.$iclientdbs !== 'undefined' ? $root.$iclientdbs : {};
    $root.$iclientdbs[MyName] = pForm;
  }
  
  //go back to last opened form if ro or db type are opened for public uses
  //*
  if (NotASubwindow && MyType!='rf') {
    var MyTargetForm = $root.$iwindows[Object.keys($root.$iwindows)[Object.keys($root.$iwindows).length-1]]
    MyTargetForm.elem.style.visibility=""
    MyTargetForm.elem.style.display=""
    pForm.elem.style.visibility="hidden"
    pForm.elem.style.display="none"
    $cform=MyTargetForm
    console.log('going back to:'+$cform.omnisclass)
  }
  //*/
};
omnis_form.prototype.$registerMethod=function (pMethodName, pForm=this){
//this will make $myMethod available as $cform.$myMethod - avoiding callMethodEx('$myMethod')
//guess it will not have a callback - else use $myMethod = function (...args) {pForm.callMethodEx,1,...args}
pForm[pMethodName]=eval('pForm.'+pForm.mMethodNamePrefix+pMethodName+'_0')};

omnis_form.prototype.$registerVar = function (pVarName, pForm=this){ eval('pForm[pVarName]= function () { return pForm.get("'+pVarName+'")}')};


//backup and restore - to be used for $undo also
omnis_form.prototype.$backupFormData = function() {localStorage.setItem('_BACKUP_'+this.mMethodNamePrefix,JSON.stringify(eval(this.instanceVars.lstData.toSource())))};
omnis_form.prototype.$restoreFormData = function(pDoOpacityCheck=true) {restoreFormData(pDoOpacityCheck,this)};

//omn_inst modified
//asking for reconnect/zombie-mode added
omnis_inst.prototype.commsHandleResultFromServer = function(a, b) {
    if (-1 == b.indexOf("ORFCMess") || -1 == b.indexOf("ORFCParam")) {
        if (b.length) {
            var c = this;
            setTimeout(function() {
                jOmnis.okMessage(jGetOmnisString(c, "error"), b)
            }, 0);
            this.lastMessage == eORFCmess.MethodWithReturn && jOmnis.hideOverlay(!0)
        }
    } else try {
        var d = jOmnis.parseJSON(b);
        null != d.OMNISServer && (this.omnisserverandport = d.OMNISServer);
        this.commsParams = d.ORFCParam;
        switch (d.ORFCMess) {
            case eORFCmess.RConnect:
                if (this.lastMessage == eORFCmess.Connect) return this.commsParamsExec(a, !0);
                break;
            case eORFCmess.RReConnect:
                if (this.lastMessage == eORFCmess.ReConnect) return this.commsParamsExec(a);
                break;
            case eORFCmess.RDisconnect:
                if (this.lastMessage == eORFCmess.Disconnect) return this.commsParamsExec(a);
                break;
            case eORFCmess.RMethod:
                if (this.lastMessage == eORFCmess.MethodWithReturn || this.lastMessage == eORFCmess.Method) return this.commsParamsExec(a);
                break;
            case eORFCmess.REvent:
                if (this.lastMessage == eORFCmess.Event) {
                    var e = this.commsParamsExec(a);
                    this.mEventResponseObject && (this.mEventResponseObject.eventResponseHasBeenProcessed(),
                        this.mEventResponseObject = null);
                    return e
                }
                break;
            case eORFCmess.ROpenAnotherForm:
                if (this.lastMessage == eORFCmess.OpenAnotherForm) return this.commsParamsExec(a);
                break;
            case eORFCmess.ROpenSubform:
                if (this.lastMessage == eORFCmess.OpenSubform) return this.commsParamsExec(a);
                break;
            case eORFCmess.RCloseSubform:
                if (this.lastMessage == eORFCmess.CloseSubform) return this.commsParamsExec(a);
                break;
            case eORFCmess.RBulkLoad:
                if (this.lastMessage == eORFCmess.BulkLoad) return this.commsParamsExec(a);
                break;
            case eORFCmess.ErrorDisconnected:
                //alert('disconnected')
            case eORFCmess.Error:
                jOmnis.setOpacity(this.elem,50);
                this.serverError = !0;
                var f;
                f = d.ORFCMess == eORFCmess.ErrorDisconnected ? jGetOmnisString(this, "disconnected") : d.ORFCParam + "";
                var g = this;
                setTimeout(function() {
                    /* original code
                    jOmnis.okMessage(jGetOmnisString(g, "error"), f)
                    */
                    //replcement start this is jOmnis.omnisInsts[???]
                    // todo: make a backup for each form loopin through all jOmnis.omnisInsts and jOmnis.omnisInsts.forms 
                    var r = confirm("Connection lost - Try to Reconnect?");
                        if (r == true) {
                            //MyStatus = $cform.callMethod("$clientcommand","savepreference",jOmnis.fn.row('_BACKUP_'+$cform.number, $cform.instanceVars.lstData.toSource()));
                            MyStatus=localStorage.setItem('_BACKUP_'+$cform.mMethodNamePrefix,JSON.stringify(eval($cform.instanceVars.lstData.toSource())))
                            jOmnis.onLoad()
                        } else {
                        var r = confirm("Continue in Zombie Mode?");
                            if (r == true) { jOmnis.setOpacity(g.elem,255);    } 
                            else { jOmnis.okMessage(jGetOmnisString(g, "error"), f)    }                                                             
                        } 
                    // replacement end
                }, 10);
                this.commsParamsClear();
                this.lastMessage == eORFCmess.MethodWithReturn && jOmnis.hideOverlay(!0);
                return !0
            }
        jOmnis.okMessage(jGetOmnisString(this, "error"), jGetOmnisString(this, "omn_inst_respbad"))

    } catch (h) {
        jOmnis.handleError(h, this), this.commsParamsClear()
    }
    return !1
};



