package ljh.sample.boot.web.controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

@Controller
public class MyController {

	private static final Logger logger = LoggerFactory.getLogger(MyController.class);

	@GetMapping("/")
	public String index() {
		logger.debug("index 화면 호출됨.");
		return "index";
	}
	
	@GetMapping("/main")
	public String main() {
		logger.debug("main 화면 호출됨.");
		return "main";
	}

	

}
