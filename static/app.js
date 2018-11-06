
(function (exports) {
	'use strict';

	exports.convert = function (sccp, cb) {
		$.post('/convert', { sccp: sccp }, cb);
	};
  //replaceAll simple method

String.prototype.replaceAll = function(search, replacement) {
	  var target = this;
	 // console.log(target.replace(new RegExp('\\b'+search+'\\b', 'g'), replacement));
	  return target.replace(new RegExp('\\b'+search+'\\b', 'g'), replacement);
};


String.prototype.replaceLine = function(search, replacement) {
	  var target = this;
	  return target.replace(new RegExp('\\s'+search+'\\s.+', 'g'), replacement);
};

String.prototype.removeBlanks = function() {
	  var target = this;
	  return target.replace(new RegExp('','gm'), '\b');
};

String.prototype.customChanges = function() {
	  var target = this;
		var tempArray = new Array();
		var tempArray2 = new Array();;
		var temp = target.split('\n');

		temp.map(dt=>{
			 if(dt == '!'){
				 tempArray2.push(tempArray);
				 tempArray = [];
			 }else{
				 tempArray.push({val:dt});
			 }
		})

		// again split by spacing
		  tempArray2.map(dt2=>{
			dt2.map(dt3=>{
				//console.log(dt3);
				//console.log(dt3.val.split(' ')[0]);
				var temp2 = dt3.val.trim();
				var temp3 = temp2.substring(0,5);
				//console.log(temp3);
				if(temp3 == 'label'){
					//console.log(temp3);
					var array2 = temp2.split(" ");
					//console.log(array2);
					if(array2[1].length > 4){
						var length = array2[1].length;
						//console.log("greater: "+array2[1]);
						var onlyNumbers = array2[1].substring(length - 4, length);
						if(/^\d+$/.test(onlyNumbers)){
							dt3.val = " label "+ onlyNumbers;
							//console.log(dt3);
						}
					}else{
						//console.log("lesser: "+array2[1]);
					}
				}
			})

		})
		//console.log(tempArray2);
		//add mwi if call-forward b2bua is present
		tempArray2.map(dt=>{
			if(dt.length > 0){
				let toggle = false;
				dt.map(dt2=>{
					if(dt2.val.indexOf('call-forward b2bua') !== -1){
						toggle = true;
					}
					if(dt2.val.indexOf('blf-speed-dial') !== -1){
						dt2.val = dt2.val + " device";
					}
				})
				if(toggle){
					dt.push({val:' mwi'});
					toggle = false;
				}
				// dt.push({val:'!'});
			}
		})

		//logic to move "description" and "cor incoming" to coressponding voice register pool
		let obj = {number:0,description:'',cor_incoming:''};
		let newarr1 = [];
		tempArray2.map(dt=>{
				if(dt.length > 0){
					let toggle2 = false;
					let num = '';
						dt.map((dt2,i)=>{
							let dtVal = dt2.val.trim();
							if(dtVal.indexOf("voice register dn") !== -1){
								let arr1 = dtVal.split(" ");
								    obj.number = arr1[arr1.length - 1];
										toggle2 = true;
							}
							if(dtVal.indexOf("voice register pool") !== -1){
										toggle2 = false;
							}
							if(toggle2){
								if(dtVal.indexOf("number") !== -1){
									let nu = dtVal.split(" ");
									num = nu[nu.length-1];
								}
								if(dtVal.indexOf("description") !== -1){
									obj.description = dt2.val;
									//delete dt2.val;
									dt.splice(i,1);
								}
								if(dtVal.indexOf("cor incoming") !== -1){
									obj.cor_incoming = dt2.val + " " +num;
									//delete dt2.val;
									dt.splice(i,1);
								}
							}

							})
							if(toggle2){
							newarr1.push(obj);
							obj = {number:0,description:'',cor_incoming:''};
							toggle2 = false;
						}
						}
						})

			//console.log(JSON.stringify(newarr1));
			//setTimeout(()=>{
console.log(tempArray2);

			tempArray2.map(dt=>{
				let count = 0;
				if(dt.length > 0){
					let toggle3 = false;
					let dtNumber2;
					dt.map((dt2,i)=>{
						count++;
						//if(dt2.val != undefined){
							let dtVal2 = dt2.val.trim();
						//}
						if(dtVal2.indexOf("description") !== -1){
							dt.splice(i,1);
						}
						if(dtVal2.indexOf("number") !== -1 && dtVal2.indexOf("dn") !== -1){
							//console.log("----xxxxxxx--------");
							let newSarray = dtVal2.split(" ");
							//console.log(newSarray)
									dtNumber2 = newSarray[newSarray.length - 1];
									toggle3 = true;
						}

						let count1 =0;
						newarr1.map(st=>{

							//console.log("----anil-----: "+dtVal2);
							//console.log("st num: "+st.number+" dtNumber2: "+dtNumber2);
							if(toggle3){
								 //console.log("----anil-----: "+dtVal2);
								if(st.number == dtNumber2){
									count1++;

									console.log("---dtNumber2----: " +dtNumber2+" count:> "+count1);
									//dt2.val = st.description;
									dt.push({val:st.description});
									dt.push({val:st.cor_incoming});
									dtNumber2 = undefined;
									toggle3 = false;
									//dt.push({val:"!"});
								}
							}
						})

					})


					toggle3 = false;
				}
				dt.push({val:'!'});
			})
			//},3000)
		// generate final string
		var result = '';
		tempArray2.map(dt=>{
			if(dt.length > 0){
				dt.map(dt2=>{
					if(dt2.val != undefined){
						result = result + dt2.val + "\n";
					}
				})
			}
		})
		//console.log(result);
	  return result;
};

    $('form').submit(function (e) {
		console.log("clicked");
        e.preventDefault();
        var form = $(this);
        var sccp = SCCP.getValue();

				sccp = sccp.replaceAll("ephone-template", "voice register template");
				sccp = sccp.replaceAll("mac-address", "id mac");
				sccp = sccp.replaceAll("ephone-dn", "voice register dn");
				sccp = sccp.replaceAll("79.+", "8851");
				sccp = sccp.replaceAll("addon 1 79..", "addon 1 CKEM");
				sccp = sccp.replaceAll("button", "");
				sccp = sccp.replaceAll("device-security-mode none", "no vad\n video");
				sccp = sccp.replaceAll("ephone", "voice register pool");
				sccp = sccp.replaceAll("octo-line", "\n shared-line max-calls 8");
				sccp = sccp.replaceAll("dual-line", "\n shared-line max-calls 2");
				sccp = sccp.replaceAll("no-reg both", "no-reg");
				sccp = sccp.replaceAll("TrnsfVM", "");
				sccp = sccp.replaceAll("HLog", "");
				sccp = sccp.replaceAll("call-forward", "call-forward b2bua");
				//sccp = sccp.replaceLine("description", "");
				sccp = sccp.replaceAll("corlist", "cor");
				sccp = sccp.replaceAll("1:(.+)", "\n number 1 dn $1");
				sccp = sccp.replaceAll("2:(.+)", "\n number 2 dn $1");
				sccp = sccp.replaceAll("3:(.+)", "\n number 3 dn $1");
				sccp = sccp.replaceAll("4:(.+)", "\n number 4 dn $1");
				sccp = sccp.replaceAll("5:(.+)", "\n number 5 dn $1");
				sccp = sccp.replaceAll("6:(.+)", "");
				sccp = sccp.replaceAll("1s(.+)", "\n number 1 dn $1");
				sccp = sccp.replaceAll("2s(.+)", "\n number 2 dn $1");
				sccp = sccp.replaceAll("3s(.+)", "\n number 3 dn $1");
				sccp = sccp.replaceAll("4s(.+)", "\n number 4 dn $1");
				sccp = sccp.replaceAll("5s(.+)", "\n number 5 dn $1");
				sccp = sccp.replaceAll("6s(.+)", "");
				sccp = sccp.replaceAll("number (.+) no-reg", "number $1\n no-reg");
				sccp = sccp.replaceAll("type 8851","type 8851 addon 1 ckem");
				sccp = sccp.customChanges();


//				sccp - sccp.removeBlanks();
//        exports.convert(sccp, function (request, result) {
				SIP.setValue(sccp);
//				});

    });

    var SCCP = CodeMirror.fromTextArea(document.getElementById("sccp"), {
		styleActiveLine: true,
		lineNumbers:true,
        matchBrackets: true
    });

    var SIP = CodeMirror.fromTextArea(document.getElementById("sip"), {
		styleActiveLine: true,
		lineNumbers:true,
        matchBrackets: true,
    });
}).call(window, window.app = {});
