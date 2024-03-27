package cmd

import (
	"fmt"
	"log"

	"github.com/spf13/cobra"
	"github.com/spf13/viper"

	"github.com/charmbracelet/bubbles/textinput"
	tea "github.com/charmbracelet/bubbletea"
	"github.com/charmbracelet/lipgloss"
)

// configCmd represents the config command
var configCmd = &cobra.Command{
	Use: "config",
	Run: func(cmd *cobra.Command, args []string) {
		p := tea.NewProgram(initialModel())

		if _, err := p.Run(); err != nil {
			log.Fatal(err)
		}

	},
}

func init() {
	rootCmd.AddCommand(configCmd)

}

type (
	errMsg error
)

const (
	appUrl = iota
	welcomekey
)

const (
	hotPink  = lipgloss.Color("#FF06B7")
	darkGray = lipgloss.Color("#767676")
)

var (
	inputStyle    = lipgloss.NewStyle().Foreground(hotPink)
	continueStyle = lipgloss.NewStyle().Foreground(darkGray)
)

type model struct {
	inputs  []textinput.Model
	focused int
	err     error
}

// Validator functions to ensure valid input
// func appUrlValidator(s string) error {
// 	validator, _ := regexp.Compile(`(http(s)?):\/\/(www\.)?a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)`)
// 	if !validator.MatchString(s) {

// 		return fmt.Errorf("appUrl is invalid")
// 	}
// 	return nil
// }

func initialModel() model {
	// Load environment variables
	eAppUrl := viper.GetString("APP_URL")
	eWelcomekey := viper.GetString("WELCOME_KEY")

	var inputs = make([]textinput.Model, 2)
	inputs[appUrl] = textinput.New()
	inputs[appUrl].Placeholder = "https://laravel.com"
	inputs[appUrl].Focus()
	inputs[appUrl].CharLimit = 270
	inputs[appUrl].Width = 30
	if eAppUrl != "" {
		inputs[appUrl].SetValue(eAppUrl)
	}

	inputs[welcomekey] = textinput.New()
	inputs[welcomekey].Placeholder = "fly.rmq.cloudamqp.com"
	inputs[welcomekey].CharLimit = 270
	inputs[welcomekey].Width = 30
	inputs[welcomekey].Prompt = ""
	if eWelcomekey != "" {
		inputs[welcomekey].SetValue(eWelcomekey)
	}
	inputs[welcomekey].EchoMode = textinput.EchoPassword

	return model{
		inputs:  inputs,
		focused: 0,
		err:     nil,
	}
}

func (m model) Init() tea.Cmd {
	return textinput.Blink
}

func (m model) Update(msg tea.Msg) (tea.Model, tea.Cmd) {
	var cmds = make([]tea.Cmd, len(m.inputs))

	switch msg := msg.(type) {
	case tea.KeyMsg:
		switch msg.Type {
		case tea.KeyEnter:
			if m.focused == len(m.inputs)-1 {
				saveConfig(m.inputs[appUrl].Value(), m.inputs[welcomekey].Value())
				return m, tea.Quit
			}
			m.nextInput()
		case tea.KeyCtrlC, tea.KeyEsc:
			return m, tea.Quit
		case tea.KeyShiftTab, tea.KeyCtrlP:
			m.prevInput()
		case tea.KeyTab, tea.KeyCtrlN:
			m.nextInput()
		}
		for i := range m.inputs {
			m.inputs[i].Blur()
		}
		m.inputs[m.focused].Focus()

	// We handle errors just like any other message
	case errMsg:
		m.err = msg
		return m, nil
	}

	for i := range m.inputs {
		m.inputs[i], cmds[i] = m.inputs[i].Update(msg)
	}
	return m, tea.Batch(cmds...)
}

func saveConfig(s1, s2 string) {
	viper.Set("APP_URL", s1)
	viper.Set("WELCOME_KEY", s2)
	viper.WriteConfig()
}

func (m model) View() string {
	return fmt.Sprintf(
		` %s
 %s			%s %s
 %s

`,
		inputStyle.Width(15).Render("Platform Url"),
		m.inputs[appUrl].View(),
		inputStyle.Width(15).Render("Welcome Key"),
		m.inputs[welcomekey].View(),
		continueStyle.Render("Continue ->"),
	) + "\n"
}

// nextInput focuses the next input field
func (m *model) nextInput() {
	m.focused = (m.focused + 1) % len(m.inputs)
}

// prevInput focuses the previous input field
func (m *model) prevInput() {
	m.focused--
	// Wrap around
	if m.focused < 0 {
		m.focused = len(m.inputs) - 1
	}
}
