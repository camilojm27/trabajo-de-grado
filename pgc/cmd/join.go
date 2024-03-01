package cmd

import (
	"pgc/pkg/join"

	"github.com/spf13/cobra"
)

// joinCmd represents the join command
var joinCmd = &cobra.Command{
	Use:   "join",
	Short: "",
	Long:  ``,
	Run: func(cmd *cobra.Command, args []string) {
		apiEndpoint := "http://localhost:8000/api/nodes"
		welcomeKey := "1234"

		join.RunJoinCommand(cmd, args, apiEndpoint+"/", welcomeKey)

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
