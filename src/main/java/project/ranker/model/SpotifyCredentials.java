package project.ranker.model;

import java.util.ArrayList;
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

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;

@Entity
@Table(name = "spotify_credentials")
public class SpotifyCredentials extends AuditModel {

	/**
	 * 
	 */
	private static final long serialVersionUID = -4981139907658637165L;

	@Id
    @GeneratedValue(generator = "spotify_credentials_generator")
    @SequenceGenerator(
            name = "spotify_credentials_generator",
            sequenceName = "spotify_credentials_sequence",
            initialValue = 1000
    )
    private Long id;
	
	@Column
	private String name;
	
	@Column
	private String clientId;

	@Column
	private String clientSecret;

	public Long getId() {
		return id;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getClientId() {
		return clientId;
	}

	public void setClientId(String clientId) {
		this.clientId = clientId;
	}

	public String getClientSecret() {
		return clientSecret;
	}

	public void setClientSecret(String clientSecret) {
		this.clientSecret = clientSecret;
	}
}
