package cmd

import (
	"fmt"
	"github.com/camilojm27/trabajo-de-grado/pgc/pkg/join"
	"log"
	"net/url"

	"github.com/google/uuid"
	"github.com/spf13/cobra"
	"github.com/spf13/viper"
)

// joinCmd represents the join command
var joinCmd = &cobra.Command{
	Use:   "join",
	Short: "",
	Long:  ``,
	Run: func(cmd *cobra.Command, args []string) {
		app := viper.Get("APP_URL")
		welcomekey := viper.Get("WELCOME_KEY")
		nodeid := viper.GetString("NODE_ID")

		if app == "" || welcomekey == "" {
			log.Fatal("Configuration is missing, run 'pgc config' to set configuration")
		}

		if app != nil && welcomekey != nil {
			_, err := url.ParseRequestURI(app.(string))
			if err != nil {
				log.Fatal("Invalid APP_URL")
			}

			if nodeid != "" {
				err := uuid.Validate(nodeid)
				if err == nil {
					fmt.Println("Ya te has unido a un cluster")
					return
				}
			}
			join.RunJoinCommand(cmd, args, app.(string), welcomekey.(string))
		}

	},
}

func init() {
	rootCmd.AddCommand(joinCmd)

	// Here you will define your flags and configuration settings.

	// Cobra supports Persistent Flags which will work for this command
	// and all subcommands, e.g.:
	// joinCmd.PersistentFlags().String("foo", "", "A help for foo")

	// Cobra supports local flags which will only run when this command
	// is called directly, e.g.:
	// joinCmd.Flags().BoolP("toggle", "t", false, "Help message for toggle")
}
