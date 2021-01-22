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
@Table(name = "option_scores")
public class OptionScore extends AuditModel {

	@Id
    @GeneratedValue(generator = "option_score_generator")
    @SequenceGenerator(
            name = "option_score_generator",
            sequenceName = "option_score_sequence",
            initialValue = 1000
    )
    private Long id;
	
	@ManyToOne
	@JoinColumn(name="option_id", nullable=false)
	@JsonBackReference
	private Option option;
	
	@Column
	private Double score;
	
	@Column
	private Date dateCollected;

	public Long getId() {
		return id;
	}
	
	public Date getDateCollected() {
		return dateCollected;
	}

	public void setDateCollected(Date dateCollected) {
		this.dateCollected = dateCollected;
	}

	public Option getOption() {
		return option;
	}

	public void setOption(Option option) {
		this.option = option;
	}

	public Double getScore() {
		return score;
	}

	public void setScore(Double score) {
		this.score = score;
	}
}
