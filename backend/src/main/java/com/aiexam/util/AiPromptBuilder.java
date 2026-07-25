package com.aiexam.util;

import org.springframework.stereotype.Component;

import java.util.Map;

@Component
public class AiPromptBuilder {

    public String buildExamPrompt(String topic, String difficulty, String questionType, int numberOfQuestions) {
        StringBuilder prompt = new StringBuilder();
        
        prompt.append("Generate ").append(numberOfQuestions)
              .append(" ").append(difficulty)
              .append(" ").append(questionType)
              .append(" questions on ").append(topic)
              .append(".\n\n");
        
        prompt.append("Requirements:\n");
        prompt.append("1. Questions must be practical and concept-based\n");
        prompt.append("2. No repeated questions\n");
        prompt.append("3. Questions should be clear and unambiguous\n");
        prompt.append("4. Questions should test understanding, not just memorization\n");
        prompt.append("5. Include real-world scenarios where applicable\n");
        
        switch (questionType.toUpperCase()) {
            case "MCQ":
                prompt.append("6. Each question must have 4 options (A, B, C, D)\n");
                prompt.append("7. Only one option should be correct\n");
                prompt.append("8. Include the correct answer\n");
                prompt.append("9. Include a brief explanation for the answer\n");
                prompt.append("\nReturn as JSON array with fields: question, options, correctAnswer, explanation\n");
                break;
                
            case "TRUE_FALSE":
                prompt.append("6. Each question must have true/false answers\n");
                prompt.append("7. Include the correct answer (true/false)\n");
                prompt.append("8. Include a brief explanation\n");
                prompt.append("\nReturn as JSON array with fields: question, correctAnswer, explanation\n");
                break;
                
            case "FILL_IN_THE_BLANK":
                prompt.append("6. Questions should have a single blank\n");
                prompt.append("7. Include the correct answer for the blank\n");
                prompt.append("8. Include a brief explanation\n");
                prompt.append("\nReturn as JSON array with fields: question, correctAnswer, explanation\n");
                break;
                
            case "SHORT_ANSWER":
                prompt.append("6. Questions should require brief written answers (1-3 sentences)\n");
                prompt.append("7. Include a model correct answer\n");
                prompt.append("8. Include concept and explanation\n");
                prompt.append("\nReturn as JSON array with fields: question, correctAnswer, explanation, concept\n");
                break;
                
            case "CODING":
                prompt.append("6. Questions should involve writing code\n");
                prompt.append("7. Include expected output or test cases\n");
                prompt.append("8. Include solution approach and explanation\n");
                prompt.append("9. Specify the programming language if needed\n");
                prompt.append("\nReturn as JSON array with fields: question, correctAnswer, explanation, testCases, concept, language\n");
                break;
        }
        
        prompt.append("\nEnsure the questions are suitable for ").append(difficulty)
              .append(" difficulty level.\n");
        prompt.append("Make the questions thought-provoking and educational.\n");
        
        return prompt.toString();
    }

    public String buildEvaluationPrompt(String question, String userAnswer, String correctAnswer, String questionType) {
        StringBuilder prompt = new StringBuilder();
        
        prompt.append("Evaluate the following answer:\n\n");
        prompt.append("Question: ").append(question).append("\n");
        prompt.append("User's Answer: ").append(userAnswer).append("\n");
        prompt.append("Correct Answer: ").append(correctAnswer).append("\n");
        prompt.append("Question Type: ").append(questionType).append("\n\n");
        
        prompt.append("Please evaluate the answer. Start your response with one of the following lines:\n");
        prompt.append("STATUS: CORRECT (if the answer is correct or has minor typos)\n");
        prompt.append("STATUS: INCORRECT (if the answer is incorrect or completely different)\n");
        prompt.append("STATUS: PARTIAL (if the answer is partially correct)\n\n");
        prompt.append("Then provide:\n");
        prompt.append("1. Score out of 100\n");
        prompt.append("2. Brief feedback on the answer\n");
        prompt.append("3. Suggestions for improvement\n");
        prompt.append("4. Key points the user missed (if any)\n");
        
        return prompt.toString();
    }

    public String buildFeedbackPrompt(Map<String, Object> examData) {
        StringBuilder prompt = new StringBuilder();
        
        prompt.append("Generate personalized feedback for the following exam results:\n\n");
        prompt.append("Topic: ").append(examData.get("topic")).append("\n");
        prompt.append("Difficulty: ").append(examData.get("difficulty")).append("\n");
        prompt.append("Question Type: ").append(examData.get("questionType")).append("\n");
        prompt.append("Score: ").append(examData.get("score")).append("/100\n");
        prompt.append("Percentage: ").append(examData.get("percentage")).append("%\n");
        prompt.append("Correct Answers: ").append(examData.get("correctAnswers")).append("\n");
        prompt.append("Wrong Answers: ").append(examData.get("wrongAnswers")).append("\n");
        prompt.append("Skipped Answers: ").append(examData.get("skippedAnswers")).append("\n");
        prompt.append("Time Taken: ").append(examData.get("timeTaken")).append(" seconds\n\n");
        
        prompt.append("Provide detailed feedback that includes:\n");
        prompt.append("1. Overall performance assessment\n");
        prompt.append("2. Specific strengths and areas for improvement\n");
        prompt.append("3. Topics/concepts that need more attention\n");
        prompt.append("4. Recommended study plan with specific actions\n");
        prompt.append("5. Tips for improvement and future preparation\n");
        prompt.append("6. Encouraging and motivating messages\n");
        
        return prompt.toString();
    }

    public String buildCodingEvaluationPrompt(String question, String userCode, String testCases) {
        StringBuilder prompt = new StringBuilder();
        
        prompt.append("Evaluate the following code solution:\n\n");
        prompt.append("Problem: ").append(question).append("\n\n");
        prompt.append("User's Code:\n```\n").append(userCode).append("\n```\n\n");
        
        if (testCases != null && !testCases.isEmpty()) {
            prompt.append("Test Cases: ").append(testCases).append("\n\n");
        }
        
        prompt.append("Evaluate the code and start your response with one of the following lines:\n");
        prompt.append("STATUS: CORRECT (if the code solves the problem correctly and passes logic)\n");
        prompt.append("STATUS: INCORRECT (if the code fails to compile, has logic bugs, or doesn't solve the problem)\n");
        prompt.append("STATUS: PARTIAL (if the code is partially working but has bugs or edge-case failures)\n\n");
        prompt.append("Then provide detailed feedback including:\n");
        prompt.append("- Overall assessment\n");
        prompt.append("- What's working well\n");
        prompt.append("- What needs improvement\n");
        prompt.append("- Time and Space Complexity\n");
        
        return prompt.toString();
    }

    public String buildExamAnalysisPrompt(Map<String, Object> analysisData) {
        StringBuilder prompt = new StringBuilder();
        
        prompt.append("Analyze the following exam performance data and provide insights:\n\n");
        prompt.append("Topic: ").append(analysisData.get("topic")).append("\n");
        prompt.append("Difficulty: ").append(analysisData.get("difficulty")).append("\n");
        prompt.append("Performance Rating: ").append(analysisData.get("performanceRating")).append("\n");
        prompt.append("Accuracy: ").append(analysisData.get("accuracy")).append("%\n");
        prompt.append("Average Time per Question: ").append(analysisData.get("avgTime")).append(" seconds\n\n");
        
        prompt.append("Based on this data, provide:\n");
        prompt.append("1. Learning style recommendations\n");
        prompt.append("2. Effective study strategies\n");
        prompt.append("3. Topics to prioritize\n");
        prompt.append("4. Confidence building strategies\n");
        prompt.append("5. Long-term learning plan\n");
        
        return prompt.toString();
    }
}