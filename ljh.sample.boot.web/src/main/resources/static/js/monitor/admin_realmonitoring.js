/************************************************* Simulation Begin *************************************************/

var chainData = "";
var chainId = "";
var chainList = new Object();
var nodeList = [];
var activeCnt = 0;
var activeNodeCnt = 0;
var totalActiveRate = 0;
var totalNodeRate = 0;
var nodeAdapter = "";


var simulationInstanceId = "";
var simulationBlockInstanceId = "";
var isSimulating = false;
var selectIdVal =  $("#nodeSelector").val();
var makeRandomBlockHash = function(){
	var charPool = ["0","1","2","3","4","5","6","7","8","9","0","a","b","c","d","e","f"];
	var randomBlockHash = "0000";
	for(var i=0;i<60;i++){
		randomBlockHash = randomBlockHash + charPool[ Math.floor((Math.random() * 100) + 1) % 16];
	}
	return randomBlockHash;
}

var setMinedInformation = function(j, randomBlockHash){
	setTimeout(function(){
		$("#height_" + j).html(Number($("#height_" + j).html()) + 1);
		$("#block_" + j).html(randomBlockHash);
		$("#txs_" + j).html("0");
		$("#bytes_mem_" + j).html("0 ");
		nodeList[j].memhistory.push(0);
		$("#graph_mem" + j).sparkline(nodeList[j].memhistory, {
	        type: 'line',
	        lineColor: '#f6a821',
	        fillColor: '#f6a821',
	        width: '150',
	        height: '100%'
		});
	}, Math.floor((Math.random() * 10) + 1) * 500);
}

var drawAdditionalSimulatedTransaction = function(from, col){
	setTimeout(function(){
		drawTransaction(hostPlots, from, 3, col);
	}, 1000);
}

var drawAdditionalSimulatedBlock = function(from, col){
	setTimeout(function(){
		drawBlock(hostPlots, from, 3, col);
	}, 1500);
}

var drawSimulatedTransaction = function(from){
	var time = (Math.floor((Math.random() * 10) + 1) * 1000);
	setTimeout(function(){
		var col = pallete[Math.floor((Math.random() * 10) + 1)];
		for(var j=0; j<nodeList.length; j++){
			if(j==from){
				continue;
			}
			drawTransaction(hostPlots, from, j, col);
			drawAdditionalSimulatedTransaction(j, col);
		}
		$("#txs_" + from).html(Number($("#txs_" + from).html()) + 1);
		var bytes = $("#bytes_mem_" + from).html().replace("B","");
		$("#bytes_mem_" + from).html((Number(bytes) + 220 + Math.floor((Math.random() * 10)))+" B");
		nodeList[from].memhistory.push(bytes);
		$("#graph_mem" + from).sparkline(nodeList[from].memhistory, {
	        type: 'line',
	        lineColor: '#f6a821',
	        fillColor: '#f6a821',
	        width: '150',
	        height: '100%'
		});
	}, time);
}

var drawSimulatedBlock = function(from){
	var time = (Math.floor((Math.random() * 10) + 1) * 1000);
	setTimeout(function(){
		var col = pallete[Math.floor((Math.random() * 10) + 1)];
		var randomBlockHash = makeRandomBlockHash();
		for(var j=0; j<nodeList.length; j++){
			if(j==from){
				continue;
			}
			drawBlock(hostPlots, from, j, col);
			drawAdditionalSimulatedBlock(j, col);
			if(nodeList[j].unit_id != "M" || nodeList[j].unit_id != "HA"){
				setMinedInformation(j, randomBlockHash);
			}
		}
		$("#height_" + from).html(Number($("#height_" + from).html()) + 1);
		$("#block_" + from).html(randomBlockHash);
		$("#txs_" + from).html("0");
		$("#bytes_mem_" + from).html("0 ");
		nodeList[from].memhistory.push("0");
		$("#graph_mem" + from).sparkline(nodeList[from].memhistory, {
	        type: 'line',
	        lineColor: '#f6a821',
	        fillColor: '#f6a821',
	        width: '150',
	        height: '100%'
		});
	}, time);
}

var startClientSimulation = function(interval){
	if(isSimulating){
		stopClientSimulation();
	}
	isSimulating = true;
	var randomBlockHash = makeRandomBlockHash();
	for(var i=0; i<nodeList.length; i++){
		//if(nodeList[i].unit_id != "M" || nodeList[i].unit_id != "m"){
			$("#connections_" + i).html("4");
			$("#block_" + i).html(randomBlockHash);
			$("#height_" + i).html("104561");
			$("#txs_" + i).html("0");
			$("#bytes_mem_" + i).html("0 ");
		//}
	}
	simulationInstanceId = setInterval(function(){
		for(var i=0; i<nodeList.length; i++){
			//if(nodeList[i].unit_id != "M"){
				drawSimulatedTransaction(i);			
			//}
		}
	}, interval);
	simulationInstanceId = setInterval(function(){
		var randomNodeIndex = Math.floor((Math.random() * 100) + 1) % 4;
		drawSimulatedBlock(randomNodeIndex);			
	}, 60000);
}

var stopClientSimulation = function(){
	console.log("########simulationInstanceId: " + simulationInstanceId);
	if(simulationInstanceId != ""){
		clearInterval(simulationInstanceId);
	}
	isSimulating = false;
}

var startServerSimulation = function(interval){
	$.get(SERVER_URL + "simulate/on/" + interval, function (data) {
		console.log(data);
	});
}

var stopServerSimulation = function(){
	$.get(SERVER_URL + "simulate/off", function (data) {
		console.log(data);
	});
}

/************************************************* Simulation End *************************************************/

/************************************************* Function Begin *************************************************/
var hostPlots;



var sendMessage = function(ws, messageId, method, params){
	var message = '{"jsonrpc":"1.0","id":"'+messageId+'","method":"'+method+'","params":'+params+'}';
	ws.send(message);
}

var loadWebSocket = function() {
	if(!("WebSocket" in window)) {
		alert("WebSocket NOT supported by your Browser!");
	}
		
	var uri = "ws://" + window.location.host + "/ws"
	var ws = new WebSocket(uri);
	
	ws.onopen = function() {
	};
	
	ws.onmessage = function (event) {
		console.log(event);
		//TODO delete
		//return;
	   	var receivedMessage = event.data.replace("[","").replace("]","").split(", ");
	   	console.log("receivedMessage---------:"+ receivedMessage);
	   	if (!Array.isArray(receivedMessage)){
	   		return;
	   	}
	   	if (receivedMessage[0] == "added"){
	   		var from = receivedMessage[2];
	   		var to = receivedMessage[3];
	   		var hash = receivedMessage[4];
	   		var col = pallete[parseInt(hash.slice(-2), 16) % 17]
	   		if ( receivedMessage[1] == "block" ){
	   			console.log("loadWebSocket---added--block----hostPlots: " + hostPlots);
	   			console.log("loadWebSocket---added--drawBlock: " + from + "  , to: " + to);
	   			drawBlock(hostPlots, from, to, col);
	   			var hash = receivedMessage[3];
	   			var height = receivedMessage[4];
	   			$("#block_" + nodeIndex).html(hash);
				$("#height_" + nodeIndex).html(height);
	   		} else if ( receivedMessage[1] == "tx" ) {
	   			var size = receivedMessage[3];
	   			var bytes = receivedMessage[4];
	   			console.log("loadWebSocket---added--tx----hostPlots: " + hostPlots);
	   			console.log("loadWebSocket---added--drawTransaction: " + from + "  , to: " + to);
	   			drawTransaction(hostPlots, from, to, col);
	   			nodeList[nodeIndex].memhistory.push(bytes);
				$("#txs_" + nodeIndex).html(size);
		   		$("#bytes_mem_" + nodeIndex).html(bytes + " ");
		   		$("#graph_mem" + nodeIndex).sparkline(nodeList[nodeIndex].memhistory, {
		            type: 'line',
		            lineColor: '#f6a821',
		            fillColor: '#f6a821',
		            width: '150',
		            height: '100%'
		        });
		   		console.log("loadWebSocket---added--tx----hostPlots: " + hostPlots);
	   			console.log("loadWebSocket---added--drawTransaction: " + from + "  , to: " + to);
	   		}
	   	} else if ( receivedMessage[0] == "changed" ){
	   		
	   		var nodeIndex = receivedMessage[2];
	   		var nodeId = receivedMessage[5];
//	   		console.log("loadWebSocket--changed---nodeIndex: " + nodeIndex);
//	   		console.log("loadWebSocket--changed---nodeId: " + nodeId);
//	   		console.log("loadWebSocket--changed---receivedMessage[1]: " + receivedMessage[1]);
	   		if ( receivedMessage[1] == "block" ){
	   			console.log("loadWebSocket---changed--block----hostPlots: " + hostPlots);
	   			var from = receivedMessage[2];
		   		var to = receivedMessage[5];
	   			var hash = receivedMessage[3];
	   			var height = receivedMessage[4];
	   			$("#block_" + nodeIndex).html(hash);
				$("#height_" + nodeIndex).html(height);
								
	   		} else if ( receivedMessage[1] == "tx" ) {
	   			var from = receivedMessage[2];
	   			var size = receivedMessage[3];
	   			var bytes = receivedMessage[4];
	   			//bytes = (bytes == 0) ?0 :Math.floor( bytes / 10000 ) / 100;
	   			nodeList[nodeIndex].memhistory.push(bytes);
				$("#txs_" + nodeIndex).html(size);
		   		$("#bytes_mem_" + nodeIndex).html(bytes + " ");
		   		$("#graph_mem" + nodeIndex).sparkline(nodeList[nodeIndex].memhistory, {
		            type: 'line',
		            lineColor: '#f6a821',
		            fillColor: '#f6a821',
		            width: '150',
		            height: '100%'
		        });
		   		console.log("loadWebSocket---changed--tx----hostPlots: " + hostPlots);
	   		} else if ( receivedMessage[1] == "cons" ){
	   			$("#connections_" + nodeIndex).html(receivedMessage[3]);
	   		}
	   	} else {
	   		return;
	   	}
	};
	
	ws.onclose = function(event) { 
		console.log("closed.");
	};
}

var loadPixi = function(num) {
	Object.keys(PIXI.utils.TextureCache).forEach(function(texture) {
	    PIXI.utils.TextureCache[texture].destroy(true);}
	);
	
    renderer = PIXI.autoDetectRenderer($("#renderer").width(), $("#renderer").height(), {
        backgroundColor: 0x2f323b,
        antialias: true,
        transparent: true,
        resolution: window.devicePixelRatio || 1,
        autoResize: true
    });
    
    $("#renderer").empty();
    $("#renderer").append(renderer.view);

    PIXI.cocoontext.CONST.TEXT_RESOLUTION =  window.devicePixelRatio;

    //Create the root of the scene graph
    stage = new PIXI.Container();

    particleContainer = new PIXI.Container();
    stage.addChild(particleContainer);

    rectContainer = new PIXI.Container();
    stage.addChild(rectContainer);

    //Start animating
    function animate() {
        requestAnimationFrame(animate);
        TWEEN.update();
        renderer.render(stage);
    }

    requestAnimationFrame(animate);
    
    //////////////////////////////////////////
    // Node 전체 표시 가운데 Alpha 적용 Circle
//    var graphics = new PIXI.Graphics();
//    if ($("select[name='optionValue'] option:selected").text() == "All" || $("select[name='optionValue'] option:selected").text() == "") {
//    	graphics.beginFill(0x292b2e,0.2);
//    	graphics.drawCircle($("#renderer").width()/2, $("#renderer").height()/2, 40);
//    	graphics.endFill();
//    	stage.addChild(graphics);
//    }
//    
//    addText("All", $("#renderer").width()/2, $("#renderer").height()/2, 16, "#FFFFFF");
    //////////////////////////////////////////
    
    //Prepare host data
    console.log("num: " + num);
    hostPlots = addRectangles(num);
}

var addText = function (text, x, y, size, color) {
    var textObj = new PIXI.Text(text, {
        font: size + 'px Arial',
        fill: color,
        align: 'center',
        stroke: '#FFFFFF',
        strokeThickness: 0
    });

    //Setting the anchor point to 0.5 will center align the text
    textObj.anchor.set(0.5);
    textObj.position.x = x;
    textObj.position.y = y;
    stage.addChild(textObj);
    return textObj;
}

var addRectangle = function (x, y, index) {
	var label = nodeList[index].unit_id;
	var name =  nodeList[index].unit_name;
	var nodeChain = nodeList[index].chain_id;
    var container = new PIXI.Container();
    var graphics = new PIXI.Graphics();
    var col = palleteForChain[nodeList[index].type];
    console.log("addRectangle, nodeList["+index+"].type:"+nodeList[index].type+" nodeList["+index+"].unit_id:"+nodeList[index].unit_id);
    graphics.clear();

    // nodeList status 확인 후 inactive일 경우 붉은 색 테두리 표시
    for(var i=0; i<chainData.length; i++) {
    	if (nodeChain.toLowerCase() == chainData[i].chain_id) {
//    		console.log("nodeList["+i+"].chain_id:"+nodeList[i].chain_id);
//    		console.log("nodeChain.toLowerCase():"+nodeChain.toLowerCase());
//    		console.log("chainData["+i+"].chain_id:"+chainData[i].chain_id);
//    		console.log("chainData["+i+"].chain_state:"+chainData[i].chain_state);
    		if (chainData[i].chain_state == "inactive") {
        		graphics.lineStyle(3, 0xFF0000);
        		
        	} else {
        		graphics.lineStyle(0);
        	}
        }
    }
    
    // Node 별 모양 및 색깔 변경
    if (label == "HA" || label == "ha") {
        // HA: circle, dark-blue
    	graphics.beginFill(0x2c3e50);
    	graphics.drawCircle(22, 23, 20);	
    } else {
    	if (label == "M" || label == "m") {
            // Mon Node: RoundRect, purple 
    		graphics.beginFill(0x9b59b6);
//    		graphics.drawRoundedRect(0, 0, 45, 45, 10);	
    		// Round 직사각형
    		graphics.drawRoundedRect(0-35, 0, 100, 25, 10);	
        } else {
            // General Node: RoundRect,         	
        	graphics.beginFill(col, 1.0);
//        	graphics.drawRoundedRect(0, 0, 45, 45, 10);
    		// Round 직사각형, 위치 조정
        	graphics.drawRoundedRect(0-35, 0, 100, 50, 10);
        }    	
    }
    graphics.endFill();
    container.addChild(graphics);

    var textObj = new PIXI.cocoontext.CocoonText(label, { 
    	font: "bold 16px Helvetica", 
    	fill : '#FFFFFF',
    });
    
    //Setting the anchor point to 0.5 will center align the text
    textObj.anchor.set(0.5);
    textObj.x = 15;
    textObj.y = 12.5;

    container.addChild(textObj);
    container.x = x;
    container.y = y;
    
    ///////////////////////////////////////////////////////
    // When you click node, you will show popup windows
//    graphics.interactive = true;
//    graphics.buttonMode = true;
//
//    // Mousedown 또는 Mouseover 시 처리
//    // graphics.mousedown =  onTouchstart.bind(undefined, "test");    
//    graphics.mouseover =  onTouchstart.bind(undefined, "test");
//    function onTouchstart(param, e) {    
//    	console.log("mouseData X: " + e.data.global.x + " Y: " + +e.data.global.y + ", label: "+label+", name: "+name);
//    	popupDetail(e.data.global.x, e.data.global.y, label, name);
//    }
    ///////////////////////////////////////////////////////
      
    rectContainer.addChild(container);
    return container;
}

//같은 체인은 같은 색깔로...블루, 초록, 회색, 빨강
var palleteForChain_old = [0x2980b9, 0x16a085, 0xbdc3c7, 0x27ae60]; 
var palleteForChain = [0x6b6bc8, 0x4e8cce, 0xa6d172, 0x6a8aed, 0x6acdd3, 0xf4e43c, 0xffab48, 0xfb8759, 0xf76c5e];
var pallete = [0x1abc9c, 0x2ecc71, 0x3498db, 0x9b59b6, 0x16a085, 0x27ae60, 0x2980b9, 0x8e44ad, 0xf1c40f, 0xe67e22,
               0xe74c3c, 0xecf0f1, 0x95a5a6, 0xf39c12, 0xd35400, 0xc0392b, 0xbdc3c7, 0x7f8c8d];

var addPoint = function (x, y, xd, yd, duration, color) {
    var graphics = new PIXI.Graphics();
    graphics.lineStyle(0);
    graphics.beginFill(color, 1);
    graphics.drawCircle(x, y, 4);
    graphics.endFill();
    particleContainer.addChild(graphics);

    var tween = new TWEEN.Tween(graphics);
    tween.to({
        "x": xd,
        "y": yd
    }, duration + 1000 * Math.random())
        .easing(TWEEN.Easing.Quartic.Out)
        .onComplete(function () {
            particleContainer.removeChild(graphics);
        })
        .start();
    return graphics;
}

var addBlock = function (x, y, xd, yd, duration, color) {
    var graphics = new PIXI.Graphics();
    graphics.lineStyle(0);
    graphics.beginFill(color, 1);
    graphics.drawRoundedRect(x - 15, y - 15, 30, 30, 10);
    graphics.endFill();
    particleContainer.addChild(graphics);

    var tween = new TWEEN.Tween(graphics);
    tween.to({
        "x": xd,
        "y": yd
    }, duration + 1000 * Math.random())
        .easing(TWEEN.Easing.Quartic.InOut)
        .onComplete(function () {
            particleContainer.removeChild(graphics);
        })
        .start();
    return graphics;
}

var addLine = function (x, y, xd, yd) {
	var graphics = new PIXI.Graphics();
    graphics.lineStyle(1, 0xEAEAEA); 
    // move the draw point to initial position
    graphics.moveTo(Math.round(x), Math.round(y));

    // draw the lines between each node
    graphics.lineTo(Math.round(xd), Math.round(yd));
    particleContainer.addChild(graphics);    
}

var getPoints = function (numItems, r, xd, yd) {
    var plots = [];
    for (var i = 0; i < numItems; i++) {
        var x = xd + r * Math.cos(2 * Math.PI * i / numItems);
        var y = yd + r * Math.sin(2 * Math.PI * i / numItems);
        plots.push({
            x: x,
            y: y
        });
    }
    return plots;
}

var addRectangles = function (i) {
    var numItems = i;
    var plots = getPoints(numItems, Math.min($("#renderer").width(), $("#renderer").height()) / 2.4, $("#renderer").width() / 2, $("#renderer").height() / 2.2);
//    console.log("addRectangles selectIdVal: " + $("select[name='optionValue'] option:selected").text());
    if ($("select[name='optionValue'] option:selected").text() == "All" || $("select[name='optionValue'] option:selected").text() == "") {
    	for (var i = 0; i < numItems; i++) {
        	// plots log
//        	console.log("plots["+i+"].x:"+plots[i].x);
//        	console.log("plots["+i+"].y:"+plots[i].y);
//        	console.log("nodeList["+i+"]: " + nodeList[i].unit_id);
            addRectangle(plots[i].x - 20, plots[i].y - 20, i);        
        }
        // Draw lines between Rectangles 일단 전체 표시 일때 선은 안 그린다
//        for (var i = 0; i < numItems-1; i++) {
//        	for (var j = 0; j < numItems-1; j++)
//        		addLine(plots[i].x, plots[i].y, plots[j+1].x, plots[j+1].y);
//        }
    } else {
    	for (var i = 0; i < numItems; i++) {
    		if ($("select[name='optionValue'] option:selected").val() == nodeList[i].chain_id) {
    			// 선택된 chain에 있는 node만 표시
    	    	addRectangle(plots[i].x - 20, plots[i].y - 20, i);    	    	   	    	
    		}
        }
    	// Draw lines between Rectangles 같은 노드끼리 연결 선 표시
//        for (var i = 0; i < numItems-1; i++) {
//        	for (var j = 0; j < numItems-1; j++)
//        		addLine(plots[i].x, plots[i].y, plots[j+1].x, plots[j+1].y);
//        }
    } 
    return plots;
}

var drawTransaction = function (coords, from, to, color) {
    var ydelta = Math.random() * 20 - 10;
    var xdelta = Math.random() * 20 - 5;
    
//    console.log("drawTransaction coords: " + coords);
//    console.log("drawTransaction coords[from].x: " + coords[from].x);
//    console.log("drawTransaction coords[to].x: " + coords[to].x);
//    console.log("drawTransaction coords[from].y: " + coords[from].y);
//    console.log("drawTransaction coords[to].y: " + coords[to].y);
        
    addPoint(coords[from].x + xdelta, coords[from].y + ydelta, coords[to].x - coords[from].x, coords[to].y - coords[from].y, 1500, color);
}

var drawBlock = function (coords, from, to, color) {
    addBlock(coords[from].x, coords[from].y, coords[to].x - coords[from].x, coords[to].y - coords[from].y, 4500, color);
}

var startMonitoring = function () {
	//TODO
	loadPixi(nodeList.length);
	
	//node list from api
	$.ajax({
		type: "GET",
		url: SERVER_URL + "monitor/generalNodeStatus",
		dataType: "JSON",
        contentType: "application/json",	
        success: function (data) {
        	var source = 
    		{
                localdata: data,
                datatype: "json",
                datafields: [
                    {name: 'chain_id', type: 'string'},
                    {name: 'unit_name', type: 'string'},
                    {name: 'unit_ip', type: 'string'},
                    {name: 'state', type: 'string'},
                    {name: 'lastblocktime', type: 'number'},
                    {name: 'unit_id', type: 'string'},
                    {name: 'lastblockheight', type: 'number'}                        
                ],
                id: 'id',
                root: 'root'
    		};
        	nodeList = data;
        	nodeList.sort(function(a, b) { 
        	    return a.unit_id < b.unit_id ? -1 : a.unit_id > b.unit_id ? 1 : 0;
        	});
        	var typeIndex = 0;
        	nodeList.forEach(function(node, index){
//        		console.log("###### node: "+ node.unit_id + " index:" + index + "  : " + nodeList[index].chain_id);
        		if ( node.node_rpc_port == "" ) {
        			node.unit_id = "M";
        		}
        		if ( index > 0 && node.chain_id != nodeList[index-1].chain_id ){
        			typeIndex++;
        		}
        		node.type = typeIndex;
        		node.memhistory = [];
        	});
        },
        complete: function (data) {
        },
        error: function (xhr, status, error) {
        }
	});
	
	
	loadWebSocket();
	//TODO
//	startClientSimulation(4500);	
}

function popup() {
	$("#blockInfoPopup1").jqxWindow({
        showCollapseButton: true, maxHeight: 800, maxWidth: 700, minHeight: 300, minWidth: 300, height: 650, width: 500,
        initContent: function () {
            $('#blockInfoPopup1').jqxWindow('focus');
        }
    });
    $("#blockInfoPopup1").jqxWindow('open');   
}

function popupDetail(dx, dy, nodeid, nodename) {
	$("#node_id").val("");
	
	$("#PopupDetail").jqxWindow({
        showCollapseButton: true, maxHeight: 400, maxWidth: 350, minHeight: 100, minWidth: 100, height: 300, width: 300, 
        initContent: function () {
            $('#PopupDetail').jqxWindow('focus');
        }
    });
	
	// renderer 내 popup위치 조정을 위해 360, 300 pixel 조정
	$("#PopupDetail").jqxWindow({ position: { x: dx+200, y: dy+200} });
    $("#PopupDetail").jqxWindow('open');   
    
    // 세부사항 Popup창에 display
    unitList(nodename);
	$('#node_id').html(nodeid);    
}

function createNodeCondition(){
	console.log("selectIdVal: " + $("select[name='optionValue']").val()); 	// all, tx1, auth, tx2
	console.log("selecttextVal: " + $("select[name='optionValue'] option:selected").text());
	
	// 체인별 선택 시 해당 노드 다시 그리기 위함
	startMonitoring();
	
	for(var i=0; i<chainData.length; i++) {
    	if ($("select[name='optionValue'] option:selected").text() == "All") {
    		$('#admin_ctn_node_utilization').html("체인 가동률");
    		$('#admin_ctn_date_transaction').html("노드 가동률");
    		return;
    	} else if ($("select[name='optionValue'] option:selected").text() == chainData[i].chain_name) {
    		$('#admin_ctn_node_utilization').html("평균 블록 추가 시간");
    		$('#admin_ctn_date_transaction').html("");
//    		createNodeGrid($("select[name='optionValue']").val());
    		return;
    	} 
    }
}

function createNodeGrid(chainId) {
	var url = SERVER_URL + "nodemonitor/info?chainId=" + chainId;
	console.log("chainId: " +chainId);
    $.post(url, function (data) {
        var source =
        {
            localdata: data,
            datatype: "json",
            datafields: [
                {name: 'node_id', type: 'string'},
                {name: 'node_name', type: 'string'},
                {name: 'type', type: 'string'},
                {name: 'node_ip', type: 'string'},
                {name: 'cluster_id', type: 'string'},
                {name: 'cluster_name', type: 'string'},
                {name: 'connected_peer_count', type: 'number'},
                {name: 'state', type: 'string'},
                {name: 'chain_id', type: 'string'}
            ],
            id: 'id',
            root: 'root'
        };
        console.log("createNodeGrid");
        console.log(data);

    });
}

var unitList = function(nodename) {
	var url = SERVER_URL + "/getNodeList";
	
	$.get(url, function (data) {
        nodeList = data;
        var source =
        {
            localdata: data,
            datatype: "json",
            datafields: [
                {name: 'chain_id', type: 'string'},
                {name: 'unit_name', type: 'string'},
                {name: 'unit_id', type: 'string'},
                {name: 'unit_ip', type: 'string'},
                {name: 'unit_type', type: 'string'}
            ],
            id: 'id',
            root: 'root'
        };
        
        for (var i = 0; i < data.length; i++) {
//        	console.log("unitList, nodename: " + nodename + " data[i].unit_name:" + data[i].unit_name);
			if (nodename == data[i].unit_name) {
				$('#node_id').html(data[i].unit_id);
				$('#chain_id').html(data[i].chain_id);
				$('#unit_type').html(data[i].unit_type);    
				$('#unit_ip').html(data[i].unit_ip);				
			}
			nodeList[i].memhistory = [];
		}

	});
}

var loadRealGrid = function(nodeList) {

	var graphRenderer = function (row, columnfield, value, defaulthtml, columnproperties) { return '<div class="block_renderer" id ="graph_mem' + row + '"></div>'; }
	var rendererMemnum = function (row, columnfield, value, defaulthtml, columnproperties) { return '<div class="block_renderer" id ="bytes_mem_' + row + '"></div>'; }
	var rendererBlock = function (row, columnfield, value, defaulthtml, columnproperties) { return '<div class="block_renderer" id ="block_' + row + '"></div>'; }
	var rendererTxs = function (row, columnfield, value, defaulthtml, columnproperties) { return '<div class="block_renderer" id ="txs_' + row + '"></div>'; }
	var rendererHeight = function (row, columnfield, value, defaulthtml, columnproperties) { return '<div class="block_renderer" id ="height_' + row + '"></div>'; }
	var rendererConnections = function (row, columnfield, value, defaulthtml, columnproperties) { return '<div class="block_renderer" id ="connections_' + row + '"></div>'; }
	
/*	var graphRenderer = function (row, columnfield, value, defaulthtml, columnproperties) { return '<div id ="graph_mem' + row + '" style="height:100%"></div>'; }
	var rendererMemnum = function (row, columnfield, value, defaulthtml, columnproperties) { return '<div id ="bytes_mem_' + row + '" style="height:100%;margin-top:9px" align="center"></div> B'; }
	var rendererBlock = function (row, columnfield, value, defaulthtml, columnproperties) { return '<div id ="block_' + row + '" style="height:100%;margin-top:9px" align="center"></div>'; }
	var rendererTxs = function (row, columnfield, value, defaulthtml, columnproperties) { return '<div id ="txs_' + row + '" style="height:100%;margin-top:9px" align="center"></div>'; }
	var rendererHeight = function (row, columnfield, value, defaulthtml, columnproperties) { return '<div id ="height_' + row + '" style="height:100%;margin-top:9px" align="center"></div>'; }
	var rendererConnections = function (row, columnfield, value, defaulthtml, columnproperties) { return '<div id ="connections_' + row + '" style="height:100%;margin-top:9px" align="center"></div>'; }*/
	//블록해쉬 커스텀 디자인
    var cellsrenderer2 = function (row, columnfield, value, defaulthtml, columnproperties) {
        return '<a href="#" onclick=popup(); class="popup" style="text-decoration: underline;">aaaaaa</a>';
    }
    
    var dataSource = [
                      {name: 'unit_id', type: 'string'},
                      {name: 'lastblocktime', type: 'number'},                      
                      {name: 'lastblockheight', type: 'number'},
                      {name: 'unit_ip', type: 'string'}
    ];
    
    
    var columnsOption = [
		/*{
		    text: '노드 이름',
		    columntype: 'textbox',
		    datafield: 'state',
		    cellsalign: 'center',
		    align: 'center',
		    cellsrenderer: stateRenderer,
		    width: "8%"
		},*/
        {
            text: 'Node ID',
            columntype: 'textbox',
            datafield: 'unit_id',
            cellsalign: 'center',
            align: 'center',
            width: "10%",
        },
        {
            text: 'best block',
            columntype: 'textbox',
            datafield: 'block',
            cellsalign: 'center',
            align: 'center',
            width: "36%",
            cellsrenderer: rendererBlock
        },
        {
            text: 'height',
            columntype: 'textbox',
            datafield: 'height',
            cellsalign: 'center',
            align: 'center',
            width: "10%",
            cellsrenderer: rendererHeight
        },
        {
            text: 'Conns',
            columntype: 'textbox',
            datafield: 'connections',
            cellsalign: 'center',
            align: 'center',
            width: "8%",
            cellsrenderer: rendererConnections
        },
        {
            text: 'Txs',
            columntype: 'textbox',
            datafield: 'txs',
            cellsalign: 'center',
            align: 'center',
            width: "8%",
            cellsrenderer: rendererTxs
        },
        {
            text: 'Mem(Size, Orphans)',
            cellsalign: 'center',
            align: 'right',
            width: "10%",
            cellsrenderer: rendererMemnum
        },
        {
            text: '',
            cellsalign: 'center',
            align: 'center',
            width: "10%",
            cellsrenderer: graphRenderer
        }
    ];
    
    var adapter = new $.jqx.dataAdapter({
    		localdata: nodeList,
            datatype: "json",
            datafields: dataSource,
            id: 'id',
            root: 'root',
            sortcolumn: 'unit_id',
            sortdirection: 'asc'	
    });
    
    $("#grid").on( 'bindingcomplete', function (event) { startMonitoring(); } );
    
    
	
    $("#grid").jqxGrid({
        width: "100%",
        height: 400,
        autoHeight:true,
        source: adapter,
        /*altrows: true,*/
        sortable: false,
        editable: false,
        filterable: false,
        columnsautoresize: true,
        rowsheight: 39,
        columnsheight:"33px",
        autoheight: true,
        autorowheight: true,
        pageable: false,
        /*theme: 'custom_grid',*/
        columns: columnsOption
    });
    
}
/**********************************
 *  실시간 테이블 작업해야할 부분
 **********************************/
function fn_searchNodeDetailInfo(){
	/*var dataObj = [	{ data1:"" , data2:'노드1001' , data3:"0NOD_001"		, data4:"Monitoring" , data5:"0" , data6:"49,903 | 1분 33초 전" 	},
	{ data1:"" , data2:'노드1001' , data3:"0NOD_001"		, data4:"Monitoring" , data5:"0" , data6:"49,903 | 1분 33초 전" 	},
	{ data1:"" , data2:'노드1001' , data3:"0NOD_001"		, data4:"Monitoring" , data5:"0" , data6:"49,903 | 1분 33초 전" 	},
	{ data1:"" , data2:'노드1001' , data3:"0NOD_001"		, data4:"Monitoring" , data5:"0" , data6:"49,903 | 1분 33초 전" 	},
	{ data1:"" , data2:'노드1001' , data3:"0NOD_001"		, data4:"Monitoring" , data5:"0" , data6:"49,903 | 1분 33초 전" 	},
	{ data1:"" , data2:'노드1001' , data3:"0NOD_001"		, data4:"Monitoring" , data5:"0" , data6:"49,903 | 1분 33초 전" 	},
	{ data1:"" , data2:'노드1001' , data3:"0NOD_001"		, data4:"Monitoring" , data5:"0" , data6:"49,903 | 1분 33초 전" 	},
	{ data1:"" , data2:'노드1001' , data3:"0NOD_001"		, data4:"Monitoring" , data5:"0" , data6:"49,903 | 1분 33초 전" 	},
	{ data1:"" , data2:'노드1001' , data3:"0NOD_001"		, data4:"Monitoring" , data5:"0" , data6:"49,903 | 1분 33초 전" 	},
	{ data1:"" , data2:'노드1001' , data3:"0NOD_001"		, data4:"Monitoring" , data5:"0" , data6:"49,903 | 1분 33초 전" 	},
	{ data1:"" , data2:'노드1001' , data3:"0NOD_001"		, data4:"Monitoring" , data5:"0" , data6:"49,903 | 1분 33초 전" 	},
	{ data1:"" , data2:'노드1001' , data3:"0NOD_001"		, data4:"Monitoring" , data5:"0" , data6:"49,903 | 1분 33초 전" 	},
	{ data1:"" , data2:'노드1001' , data3:"0NOD_001"		, data4:"Monitoring" , data5:"0" , data6:"49,903 | 1분 33초 전" 	},
	];

var source =
{
localdata: dataObj,
datatype: "array"
};*/

var url = SERVER_URL + "monitor/getUnitListByChainId?chain_id=" + chainId;

$.post(url, function (data) {
	var source =
	{
			localdata: data,
			datatype: "json",
			datafields: [
				{name: 'state', type: 'string'},
			    {name: 'unit_id', type: 'string'},
			    {name: 'unit_name', type: 'string'},
			    {name: 'unit_type', type: 'string'},
			    {name: 'unit_ip', type: 'string'},
			    {name: 'lastblockheight', type: 'string'},
			    {name: 'lastblocktime', type: 'number'},
			    {name: 'lastblockid', type: 'string'},
			    {name: 'connected_peer', type: 'number'},
			    {name: 'chain_id', type: 'string'}
			],
			id: 'id',
			root: 'root'
	};
	
	
	var cellsrenderer = function (row, column, value) 
	{
		var rowState = $('#jqxgrid').jqxGrid('getcell', row, "state").value;
		if( rowState == 'inactive' ){
			return '<div class="grid_inactive"><span></span></div>';
		}else{
			return '<div class="grid_active"><span></span></div>';
		}
	}

	var customcellsrenderer = function (row, column, value) 
	{
	 		var heigth = $('#jqxgrid').jqxGrid('getcell', row, "lastblockheight").value;
	 		if (typeof(heigth) == "undefined") {	//없으면 추가
	 			heigth = 0;
	 		}else{
	 			heigth = numberFormat(heigth);
	 		}
		var date = timesDifferenceForBlockTime(value);
		//return '<div class="jqx-grid-cell-middle-align">'+heigth +' | '+ date + '</div>';
		return '<div class="grid_underline">'+heigth +' | '+ date + '</div>';
	}
	var peer = function (row, column, value) 
	{
		if(value == ""){
			return '<div class="grid_underline">'+0 + '</div>';
		}else{
			return '<div class="grid_underline">'+value + '</div>';
		}
	}
	
//	var lastblocktime = $('#grid01').jqxGrid('getcell', row, "lastblocktime").value;
//	lastblocktime = timesDifferenceForBlockTime(lastblocktime);
//	
//	var rtnValue =  '<div "style="padding:15px 0 0 0;align:center; "><a href="#" class="" style="text-decoration: underline; ">' + value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + '</a>';
//	rtnValue += '&nbsp| &nbsp';
//	rtnValue += '<a href="#" class="" style="text-decoration: underline;">' + lastblocktime + '</a></div>';
//    return rtnValue;
	
	var customheader = function (row, column, value) 
	{
		return '<div class="grid-ico-sort"><span>' + row + '</span></div>';
	}
	
	var underline = function (row, column, value) 
	{
		return '<div class="grid_underline"><span>' + value + '</span></div>';
	}
	
	var pagerrenderer = function () {
        var element = $("<div class='paging'></div>");
        var paginginfo = $("#jqxgrid").jqxGrid('getpaginginformation');

        element.append("<a href='#none' class='cmn_icon firstprev'></a>")
		element.append("<a href='#none' class='cmn_icon prev'></a>");

        for (i = 0; i < paginginfo.pagescount; i++) {
            

            var anchor = $("<a href='#" + i + "'>" + (i+1) + "</a>");
            if( i == 0 ) anchor.addClass( "active");
            anchor.appendTo(element);
            anchor.click(function (event) {
                $(".paging a").removeClass ("active" );
                $(this).addClass ("active" );
                var pagenum = parseInt($(event.target).text());
                $("#jqxgrid").jqxGrid('gotopage', pagenum);
            });
        }

        
		element.append("<a href='#none' class='cmn_icon next'></a>");
		element.append("<a href='#none' class='cmn_icon lastnext'></a>")

        return element;
    }
	/*$("#jqxgrid").jqxGrid(
	{
	width: "100%",
	height: 480,
	source: source,                
	columnsheight:"33px",
	pageable: true,
//	pagerrenderer: pagerrenderer,
	pagermode: 'simple',
	rowsheight: 39,
	columns: [
	          { text: '상태'			, datafield: 'state_icon' , cellsalign: 'center', align: 'center'	, width: "6%" , renderer: customheader , cellsrenderer:cellsrenderer},
	          { text: '상태hidden'	, datafield: 'state' , hidden : true},
	          { text: '이름'			, datafield: 'unit_name' , cellsalign: 'center', align: 'center'	, width: "10%" , renderer: customheader},
	          { text: 'ID'			, datafield: 'unit_id' , cellsalign: 'center', align: 'center'	, width: "32%" , renderer: customheader},
	          { text: '유형'			, datafield: 'unit_type' , cellsalign: 'center', align: 'center'	, width: "26%" , renderer: customheader},
	          { text: '연결 노드'	, datafield: 'connected_peer' , cellsalign: 'center', align: 'center'	, width: "6%" , renderer: customheader, cellsrenderer:peer},
	          { text: '최신 블록'	, datafield: 'lastblocktime' , cellsalign: 'center', align: 'center'	, width: "20%", renderer: customheader, cellsrenderer:customcellsrenderer},
	          { text: 'lastblockid'	, datafield: 'lastblockid' , hidden: true },
	          { text: 'lastblockheight'	, datafield: 'lastblockheight' , hidden: true },
	          { text: 'chain_id '	, datafield: 'chain_id' , hidden: true  },
	        ] ,
	});*/
	
	
	var source01 = [ "10개씩 보기", "20개씩 보기", "30개씩 보기","40개씩 보기", "50개씩 보기" ];
	$("#jqxdropdownlist").jqxDropDownList({ source: source01, selectedIndex: 0, checkboxes:false, width:90, height:25, dropDownHeight:127, openDelay:0, closeDelay:0});
	$("#totalCount01").text(data.length);
});
}

var testwebSocket = function() {
	setTimeout(testwebSocket, 10000);
	$.ajax({
		type: "GET",
		url: SERVER_URL + "admin_restart_websocket",
		dataType: "JSON",
        contentType: "application/json",	
        success: function (data) {
        	
	    },
	    complete: function (data) {
	    },
	    error: function (xhr, status, error) {
	    }
	});
}
/************************************************* Function End *************************************************/
$(document).ready(function () {
	// Initialize
	$('#admin_ctn_node_utilization').html("Chain rate of operation");
	$('#admin_ctn_date_transaction').html("Node rate of operation");
	
//	// ChainList Select Box
//	$.ajax({
//        type: "GET",
//        url: "chain/chainList",
//        success: function (data) {
//        	chainList = data;
//        	var optionsAsString = "";
//        	var options = "";
//        	optionsAsString += "<option value='" + "all" + "'>" + "All" + "</option>";
//            for(var i = 0; i < data.length; i++) {
//                optionsAsString += "<option value='" + data[i].chain_id + "'>" + data[i].chain_name + "</option>";
////                options += data[i].chain_name;
//            }
////            TODO
//            $("select[name='optionValue']").find('option').remove().end().append($(optionsAsString));    
////            console.log("-----options: " + options);
////            var source01 = [ $(options)];
////        	$("#jqxdropdownlist-node").jqxDropDownList({ source: source01, selectedIndex: 0, checkboxes:false, width:90, height:25, dropDownHeight:127, openDelay:0, closeDelay:0});
//
//        },
//        complete: function (data) {
//        	
//        },
//        error: function (xhr, status, error) {
//            console.log(error);
//        }
//    });	
	
	
	// Node Info
	// TODO
	$.ajax({
		type: "GET",
		url: SERVER_URL + "/getNodeList",
		dataType: "JSON",
        contentType: "application/json",	
        success: function (data) {
        	var source = 
    		{
                localdata: data,
                datatype: "json",
                datafields: [
                    {name: 'unit_id', type: 'string'},
                    {name: 'unit_ip', type: 'string'},
                    {name: 'node_rpc_port', type: 'number'},
                    {name: 'node_rpc_user', type: 'string'},
                    {name: 'node_rpc_password', type: 'string'},
                    {name: 'lastblocktime', type: 'number'},
                    {name: 'lastblockheight', type: 'number'}
                ],
                id: 'id',
                root: 'root'
    		};
        	nodeList = data;
        	nodeList.sort(function(a, b) { 
        	    return a.unit_id < b.unit_id ? -1 : a.unit_id > b.unit_id ? 1 : 0;
        	});
        	var typeIndex = 0;
        	nodeList.forEach(function(node, index){
        		if ( index > 0 ){
        			typeIndex++;
        		}
        		node.type = typeIndex;
        		node.memhistory = [];
        	});
        	
            
            // TODO MonNode 포함 List                         
            //$("#new_block_time").html(totalNodeRate.toFixed(2) + "%");  
            
        	loadRealGrid(nodeList);
        },
        complete: function (data) {
            //통신이 실패했어도 완료가 되었을 때

        	console.log("완료");
        },
        error: function (xhr, status, error) {
            console.log("실패");
        }
	});
		
	// Chain Info
//	$.ajax({
//        type: "POST",
//        url: SERVER_URL + "chainmonitor/info",
//        dataType: "JSON",
//        contentType: "application/json",
//        success: function (data) {
//        	var source =
//            {
//                localdata: data,
//                datatype: "json",
//                datafields: [
//                    {name: 'chain_name', type: 'string'},
//                    {name: 'chain_id', type: 'string'},
//                    {name: 'last_block_hash', type: 'string'},
//                    {name: 'avg_block_time', type: 'number'},
//                    {name: 'total_node_count', type: 'number'},
//                    {name: 'transactionperhour', type: 'number'},
//                    {name: 'chain_state', type: 'string'},
//                    {name: 'branch_count', type: 'number'},
//                ],
//                id: 'id',
//                root: 'root'
//            };
//
//            chainData = data;
//            
//            // 평균 블록 추가 시간
//            for(var i=0; i<data.length; i++) {
//            	if (data[i].chain_state == "active") {
//            		activeCnt++;
//            	}
//            }
//            
//            totalActiveRate = (activeCnt / data.length) * 100;
//            console.log("activeCnt: " + activeCnt);
//            console.log("data.length: " + data.length);
//            console.log("totalActiveRate: " + totalActiveRate);
//
//            // TODO MonNode 포함 List                         
//            $("#avg_block_time").html(totalActiveRate.toFixed(2) + "%");            
//        },
//        complete: function (data) {
//            //통신이 실패했어도 완료가 되었을 때
//            console.log("완료");
//        },
//        error: function (xhr, status, error) {
//            console.log("실패");
//        }
//    });
	
	
	//testwebSocket();
	//fn_searchNodeDetailInfo();
	$("#blockInfoPopup1").hide();
	$("#PopupDetail").hide();
//	$("#chainInfoPopup").hide();
	
	
  //노드 정보 미니팝업
//  $('.nodeInfo').click(function(data){
//  	
//  	$("#popupNodeName").html("");
//  	$("#popupConnectPeer").html("");
//  	$("#popupLastBlock").html("");
//  	
//  	console.log("노드팝업data");
//  	console.log(data);
//  	var chainTableId = data.currentTarget.id;
//  	var nodeTableId;
//  	if(data.target.className == "activeStateIcon" || data.target.className == "inactiveStateIcon"){
//  		nodeTableId = data.target.firstChild.data;
//  	}else{
//  		nodeTableId = data.target.className;
//  	}
//  	for(var i = 0; i < chainList.length; i++){
//  		for(var j=0; j < chainList[i].nodeList.length; j++){
//  			
//  			if(chainTableId == chainList[i].chain_id){
//		    		if(nodeTableId == chainList[i].nodeList[j].unit_id){
//		    			if(chainList[i].nodeList[j].state == "Alive"){
//		    				$("#nodeStateIcon")[0].className = "activeStateIconMiniPopup txt_l"; 
//		    			}else{
//		    				$("#nodeStateIcon")[0].className = "inactiveStateIconMiniPopup txt_l";
//		    			}
//		    			$("#popupNodeName").html(chainList[i].nodeList[j].unit_name);
//		    			$("#popupConnectPeer").html(chainList[i].nodeList[j].connected_peer.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","));
//		    			var blockHeight = chainList[i].nodeList[j].lastblockheight.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
//		    			var blockTime = timesDifferenceForBlockTime(chainList[i].nodeList[j].lastblocktime);
//		    			$("#popupLastBlock").html(blockHeight + " | " + blockTime);
//		    		}
//  			}
//  		}
//  	}
//  	$("#nodeInfoPopup").css("left", data.pageX - 43);
//  	$("#nodeInfoPopup").css("top", data.pageY);
//  	$("#nodeInfoPopup").show();
//  });
});
