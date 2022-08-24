package simplessh.com.request;

import lombok.*;

/**
 * @author Corneli F.
 */
@Data
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class LoginRequest {
    private String username;
    private String password;

}
