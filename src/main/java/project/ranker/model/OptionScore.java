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
import com.fasterxml.jackson.annotation.JsonManagedReference;

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
	private Option option;
	
	@ManyToOne
	@JoinColumn(name="rank_session_id", nullable=false)
	@JsonBackReference(value="optionScoreRankSession")
	private RankSession rankSession;
	
	@Column
	private Double score;
	
	@Column
	private Integer timesRanked;

	public Long getId() {
		return id;
	}

	public Option getOption() {
		return option;
	}

	public void setOption(Option option) {
		this.option = option;
	}

	public RankSession getRankSession() {
		return rankSession;
	}

	public void setRankSession(RankSession rankSession) {
		this.rankSession = rankSession;
	}

	public Double getScore() {
		return score;
	}

	public void setScore(Double score) {
		this.score = score;
	}

	public Integer getTimesRanked() {
		return timesRanked;
	}

	public void setTimesRanked(Integer timesRanked) {
		this.timesRanked = timesRanked;
	}
}
