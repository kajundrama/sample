package ljh.sample.boot.web.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.web.servlet.config.annotation.ViewResolverRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@EnableAsync
@Configuration
public class AutoConfig {

//	@Bean
//    public WebMvcConfigurer corsConfigurer() {
//		new WebMvcConfigurer() {
//			@Override
//		    public void configureViewResolvers(ViewResolverRegistry registry) {
//		        registry.jsp();//default prefix=/WEB-INF/", suffix=".jsp"
//		    }
//		};
//		return null;
//        
//    }
}
