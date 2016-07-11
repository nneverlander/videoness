package com.videoness.rest;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

/**
 * Created by adi on 7/7/16.
 */
@Controller
public class Test {

    private static Logger log = LoggerFactory.getLogger(Test.class);

    @RequestMapping(value = "/test")
    @ResponseBody
    public String get() {
        if (log.isDebugEnabled()) return "debug";
        else if (log.isInfoEnabled()) return "info";
        else if (log.isWarnEnabled()) return "warn";
        else return "error";
    }

}
