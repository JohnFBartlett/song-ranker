package project.ranker;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.stream.Stream;

import org.springframework.boot.ApplicationRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.context.annotation.Bean;
import org.springframework.core.Ordered;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

import project.ranker.model.Category;
import project.ranker.model.Option;
import project.ranker.repositories.CategoryRepository;
import project.ranker.repositories.OptionRepository;


@SpringBootApplication
@EnableJpaAuditing
public class RankerApplication {

	public static void main(String[] args) {
		SpringApplication.run(RankerApplication.class, args);
	}
	
	// Bootstrap some test data into the in-memory database
//    @Bean
//    ApplicationRunner init(
//    		CategoryRepository categoryRepository,
//    		OptionRepository optionRepository
//    		) {
//    	Category category = new Category();
//        category.setName("TestCategory");
//        
//        categoryRepository.save(category);
//        return args -> {
//            Stream.of("FirstOption", "SecondOption", "ThirdOption", "FourthOption")
//            .forEach(name -> {
//                    
//                    
//                    Option option = new Option();
//                    option.setCategory(category);
//                    option.setName(name);
//                    optionRepository.save(option);
//            });  
//            optionRepository.findAll().forEach(System.out::println);  
//        };  
//    }  

    // Fix the CORS errors
    @Bean
    public FilterRegistrationBean simpleCorsFilter() {  
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();  
        CorsConfiguration config = new CorsConfiguration();  
        config.setAllowCredentials(true); 
        // *** URL below needs to match the Vue client URL and port ***
//        List<String> allowedOrigins = new ArrayList<String>(
//        		Arrays.asList(
//        				"http://localhost",
//        				"https://localhost",
//        				"http://localhost:8080",
//        				"http://127.0.0.1:8080",
//        				"http://localhost:4200",
//        				"http://127.0.0.1:4200",
//        				"http://localhost:80",
//        				"http://127.0.0.1:80",
//        				"http://localhost:443",
//        				"http://127.0.0.1:443",
//        				"https://localhost:443",
//        				"https://127.0.0.1:443",
//        				"http://watermap.io",
//        				"https://watermap.io",
//        				"http://73.38.255.81",
//        				"https://73.38.255.81"
//        				)
//        );
        List<String> allowedOrigins = new ArrayList<String>(
        		Arrays.asList(
        				"*"
        				)
        );
        config.setAllowedOrigins(Collections.unmodifiableList(allowedOrigins)); 
        config.setAllowedMethods(Collections.singletonList("*"));  
        config.setAllowedHeaders(Collections.singletonList("*"));  
        source.registerCorsConfiguration("/**", config);  
        FilterRegistrationBean bean = new FilterRegistrationBean<>(new CorsFilter(source));
        bean.setOrder(Ordered.HIGHEST_PRECEDENCE);  
        return bean;  
    }   
}
