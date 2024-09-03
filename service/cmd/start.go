package cmd

import (
	"io"
	"log"

	"github.com/camilojm27/trabajo-de-grado/service/pkg/start"
	"github.com/spf13/cobra"
	"github.com/spf13/viper"
)

// startCmd represents the start command
var startCmd = &cobra.Command{
	Use:   "start",
	Short: "",
	Long:  ``,
	Run: func(cmd *cobra.Command, args []string) {
		appUrl := viper.GetString("APP_URL")
		nodeID := viper.GetString("NODE_ID")
		welcomeKey := viper.GetString("WELCOME_KEY")
		rabbitmqHost := viper.GetString("RABBITMQ_HOST")
		rabbitmqPort := viper.GetString("RABBITMQ_PORT")
		rabbitmqLogin := viper.GetString("RABBITMQ_LOGIN")
		rabbitmqPassword := viper.GetString("RABBITMQ_PASSWORD")
		println(appUrl, welcomeKey, nodeID, rabbitmqHost, rabbitmqPort, rabbitmqLogin, rabbitmqPassword)
		if appUrl == "" || welcomeKey == "" {
			log.Fatal("Configuration is missing, run 'pgc config' to set configuration")
		}
		if nodeID == "" || rabbitmqHost == "" || rabbitmqPort == "" || rabbitmqLogin == "" || rabbitmqPassword == "" {
			log.Fatal("Rabbitmq Configuration is missing, run 'pgc join' to set configuration")
		}

		start.RunStartCommand(cmd, args, appUrl)

		// cli, _ := client.NewClientWithOpts(client.FromEnv)

		// defer cli.Close()
		// stats, _ := cli.ContainerStats(context.Background(), "some-postgres", false)
		// fmt.Println(stats)
		// fmt.Println(stats.OSType)
		// r, _ := stats.Body.Read()
		// //rr, _ := io.ReadAll()
		// fmt.Println(string())

	},
}

func init() {

	rootCmd.AddCommand(startCmd)

	// Here you will define your flags and configuration settings.

	// Cobra supports Persistent Flags which will work for this command
	// and all subcommands, e.g.:
	// startCmd.PersistentFlags().String("foo", "", "A help for foo")

	// Cobra supports local flags which will only run when this command
	// is called directly, e.g.:
	// startCmd.Flags().BoolP("toggle", "t", false, "Help message for toggle")
}

func readWithReadAll(reader io.ReadCloser) ([]byte, error) {
	data, err := io.ReadAll(reader)
	if err != nil {
		return nil, err
	}
	return data, nil
}
