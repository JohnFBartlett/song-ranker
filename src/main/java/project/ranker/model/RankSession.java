package project.ranker.model;

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

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;

@SuppressWarnings("serial")
@Entity
@Table(name = "rank_sessions")
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
	@JsonBackReference(value="rankSessionCategory")
	private Category category;
	
	@OneToMany(
		mappedBy="rankSession",
		cascade=CascadeType.ALL)
	@JsonManagedReference(value="optionScoreRankSession")
	private List<OptionScore> optionScores;
	
	@Column
	private String ranker;

	public Long getId() {
		return id;
	}

	public Category getCatgeory() {
		return this.category;
	}

	public void setCategory(Category category) {
		this.category = category;
	}

	public List<OptionScore> getOptionScores() {
		return optionScores;
	}

	public void setOptionScores(List<OptionScore> optionScores) {
		this.optionScores = optionScores;
	}

	public String getRanker() {
		return ranker;
	}

	public void setRanker(String ranker) {
		this.ranker = ranker;
	}
}
