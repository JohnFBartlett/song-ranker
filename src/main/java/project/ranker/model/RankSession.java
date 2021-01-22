package project.ranker.model;

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
@Table(name = "options")
public class RankSession extends AuditModel {

	@Id
    @GeneratedValue(generator = "rank_session_generator")
    @SequenceGenerator(
            name = "rank_session_generator",
            sequenceName = "rank_session_sequence",
            initialValue = 1000
    )
    private Long id;
	
	@ManyToOne
	@JoinColumn(name="category_id", nullable=false)
	@JsonBackReference
	private Category category;
	
	@Column
	private String name;
	
	@Column
	private Date dateCollected;
	
	@Column
	private Double height;
	
	@Column
	private Double volume;

	public Long getId() {
		return id;
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

	public Category getCatgeory() {
		return category;
	}

	public void setCategory(Category category) {
		this.category = category;
	}
}
