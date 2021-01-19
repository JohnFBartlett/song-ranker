package project.water.watermap.repositories;

import org.springframework.data.rest.core.config.RepositoryRestConfiguration;
import org.springframework.data.rest.webmvc.config.RepositoryRestConfigurer;
import org.springframework.stereotype.Component;

import project.water.watermap.model.WaterMeasurement;
import project.water.watermap.model.WaterSource;

/**
 * IDs are not returned by RestRepository by default. I like them exposed so that the client can easily find
 * the ID of created and listed resources.
 * */
@Component
public class RestRepositoryConfigurator implements RepositoryRestConfigurer {

  @Override
  public void configureRepositoryRestConfiguration(RepositoryRestConfiguration config) {
    config.exposeIdsFor(WaterSource.class);
    config.exposeIdsFor(WaterMeasurement.class);
  }
}
