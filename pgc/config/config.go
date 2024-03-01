package config

// Config holds connection details
type Config struct {
	Host     string `json:"host"`
	Port     string `json:"port"`
	Username string `json:"username"`
	Password string `json:"password"`
}

// LoadConfig reads configuration from a file (replace with your implementation)
func LoadConfig() (Config, error) {
	// Implement logic to read configuration from a file/environment variables
	// This is a placeholder, replace with your actual implementation
	return Config{
		Host:     "localhost",
		Port:     "5672",
		Username: "guest",
		Password: "guest",
	}, nil
}
