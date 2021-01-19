package project.water.watermap.model;

import java.util.Date;
import java.util.List;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.SequenceGenerator;
import javax.persistence.Table;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;

@Entity
@Table(name = "water_sources")
public class WaterSource extends AuditModel {

	/**
	 * 
	 */
	private static final long serialVersionUID = -4981139907658637165L;

	@Id
    @GeneratedValue(generator = "water_source_generator")
    @SequenceGenerator(
            name = "water_source_generator",
            sequenceName = "water_source_sequence",
            initialValue = 1000
    )
    private Long id;
	
	@Column
	private String type;
	
	@Column
	private String name;
	
	@Column
	private Date dateFound;
	
	@Column
	private Double squareFootage;
	
	@Column
	private Double xCoor;
	
	@Column
	private Double yCoor;
	
	@OneToMany(
		mappedBy="source",
		cascade=CascadeType.ALL)
	@JsonManagedReference
	private List<WaterMeasurement> measurements;

	public Long getId() {
		return id;
	}
	
	public String getType() {
		return type;
	}

	public void setType(String type) {
		this.type = type;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public Double getxCoor() {
		return xCoor;
	}

	public void setxCoor(Double xCoor) {
		this.xCoor = xCoor;
	}

	public Double getyCoor() {
		return yCoor;
	}

	public void setyCoor(Double yCoor) {
		this.yCoor = yCoor;
	}

	public Date getDateFound() {
		return dateFound;
	}

	public void setDateFound(Date dateFound) {
		this.dateFound = dateFound;
	}

	public Double getSquareFootage() {
		return squareFootage;
	}

	public void setSquareFootage(Double squareFootage) {
		this.squareFootage = squareFootage;
	}

	public List<WaterMeasurement> getMeasurements() {
		return measurements;
	}

	public void setMeasurements(List<WaterMeasurement> measurements) {
		this.measurements = measurements;
	}
	
	
}
