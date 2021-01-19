package project.water.watermap.model;

import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.SequenceGenerator;
import javax.persistence.Table;

import com.fasterxml.jackson.annotation.JsonBackReference;

@SuppressWarnings("serial")
@Entity
@Table(name = "water_measurements")
public class WaterMeasurement extends AuditModel {

	@Id
    @GeneratedValue(generator = "water_measurement_generator")
    @SequenceGenerator(
            name = "water_measurement_generator",
            sequenceName = "water_measurement_sequence",
            initialValue = 1000
    )
    private Long id;
	
	@ManyToOne
	@JoinColumn(name="source_id", nullable=false)
	@JsonBackReference
	private WaterSource source;
	
	@Column
	private Date dateMeasured;
	
	@Column
	private Date dateCollected;
	
	@Column
	private Double height;
	
	@Column
	private Double volume;

	public Long getId() {
		return id;
	}

	public Date getDateMeasured() {
		return dateMeasured;
	}

	public void setDateMeasured(Date dateMeasured) {
		this.dateMeasured = dateMeasured;
	}

	public Date getDateCollected() {
		return dateCollected;
	}

	public void setDateCollected(Date dateCollected) {
		this.dateCollected = dateCollected;
	}

	public Double getHeight() {
		return height;
	}

	public void setHeight(Double height) {
		this.height = height;
	}

	public Double getVolume() {
		return volume;
	}

	public void setVolume(Double volume) {
		this.volume = volume;
	}

	public WaterSource getSource() {
		return source;
	}

	public void setSource(WaterSource source) {
		this.source = source;
	}
}
