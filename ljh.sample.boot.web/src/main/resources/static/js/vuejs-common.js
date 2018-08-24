//로딩 이미지
Vue.component('loading-comp',{
	template : ' <div id="loading">\
					<img id="loading-image" src="../img/loading.gif" alt="Loading..." />\
				</div>'
})

//side bar
Vue.component('left-side',{
	template : ' <div id="sidebar-wrapper">\
						<ul class="sidebar-nav">\
						<li class="sidebar-brand"><a href="/../main"> Nexledger API Menu</a></li>\
						<li><a href="/../transaction">Transaction</a></li>\
						<li><a href="/../txHistory">Tx History</a></li>\
						<li><a href="/../opTransaction">OpData</a></li>\
						<li class="logout"><a href="/../logout">Log Out</a></li>\
					</ul>\
				</div>'
})