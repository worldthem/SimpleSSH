package simplessh.com.response;

import lombok.*;

import java.util.List;

@Data
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class JwtResponse {
    private String accessToken;
    private String type = "Bearer";
    private String username;
    private List<String> roles;

}
