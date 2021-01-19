package project.water.watermap;

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

import project.water.watermap.model.WaterMeasurement;
import project.water.watermap.model.WaterSource;
import project.water.watermap.repositories.WaterMeasurementRepository;
import project.water.watermap.repositories.WaterSourceRepository;

@SpringBootApplication
@EnableJpaAuditing
public class WaterMapApplication {

	public static void main(String[] args) {
		SpringApplication.run(WaterMapApplication.class, args);
	}
	
//	// Bootstrap some test data into the in-memory database
//    @Bean
//    ApplicationRunner init(
//    		WaterSourceRepository sourceRepository,
//    		WaterMeasurementRepository measurementRepository
//    		) {
//        return args -> {
//            Stream.of("Wachusett", "Big", "Smol", "One with water", "One with poison").forEach(name -> {
//                    WaterSource source = new WaterSource();
//                    source.setType("Reservoir");
//                    source.setName(name);
//                    
//                    double anchoredY = 39.0997;
//                    double randAdditionY = 20* (Math.random() - Math.random());
//                    source.setyCoor(anchoredY + randAdditionY);
//                    double anchoredX = 94.5786;
//                    double randAdditionX = 30* (Math.random() - Math.random());
//                    source.setxCoor(anchoredX + randAdditionX);
//                    
//                    sourceRepository.save(source);
//                    
//                    WaterMeasurement measurement = new WaterMeasurement();
//                    measurement.setSource(source);
//                    measurement.setHeight(10.0);
//                    measurement.setVolume(3000.0);
//            });  
//            sourceRepository.findAll().forEach(System.out::println);  
//        };  
//    }  

    // Fix the CORS errors
    @Bean
    public FilterRegistrationBean simpleCorsFilter() {  
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();  
        CorsConfiguration config = new CorsConfiguration();  
        config.setAllowCredentials(true); 
        // *** URL below needs to match the Vue client URL and port ***
        List<String> allowedOrigins = new ArrayList<String>(
        		Arrays.asList(
        				"http://localhost",
        				"https://localhost",
        				"http://localhost:8080",
        				"http://127.0.0.1:8080",
        				"http://localhost:80",
        				"http://127.0.0.1:80",
        				"http://localhost:443",
        				"http://127.0.0.1:443",
        				"https://localhost:443",
        				"https://127.0.0.1:443",
        				"http://watermap.io",
        				"https://watermap.io"
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
