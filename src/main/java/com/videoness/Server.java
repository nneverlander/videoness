package com.videoness;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

import javax.servlet.ServletContextEvent;
import javax.servlet.ServletContextListener;

/**
 * Created by adi on 7/7/16.
 */
@SpringBootApplication
public class Server {

    private static final Logger log = LoggerFactory.getLogger(Server.class);

    @Bean
    protected ServletContextListener listener() {
        return new ServletContextListener() {

            @Override
            public void contextInitialized(ServletContextEvent sce) {
                log.info("ServletContext initialized");
            }

            @Override
            public void contextDestroyed(ServletContextEvent sce) {
                log.info("ServletContext destroyed");
            }

        };
    }

    public static void main(String[] args) throws Exception {
        SpringApplication.run(Server.class, args);
    }

}
