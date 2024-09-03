package util

import "regexp"

func SafeString(b []byte) string {
	// Convert byte slice to string
	logString := string(b)

	// Remove non-printable characters using a regex
	re := regexp.MustCompile(`[^\x20-\x7E]`)
	cleanedString := re.ReplaceAllString(logString, "")

	return cleanedString
}
