package project.water.watermap.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import project.water.watermap.model.WaterMeasurement;

@Repository 
public interface WaterMeasurementRepository extends JpaRepository<WaterMeasurement, Long> {

}
