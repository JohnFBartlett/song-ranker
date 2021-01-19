package project.water.watermap.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import project.water.watermap.model.WaterSource;  

@Repository 
public interface WaterSourceRepository extends JpaRepository<WaterSource, Long> {

}
