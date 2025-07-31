import json
import re
from groq import Groq
from django.conf import settings

class GroqAIProcessor:
    def __init__(self):
        if not settings.GROQ_API_KEY:
            print("Warning: GROQ_API_KEY not set. Using fallback responses.")
            self.client = None
        else:
            self.client = Groq(api_key=settings.GROQ_API_KEY)
        self.model = "deepseek-r1-distill-llama-70b"
    
    def analyze_note(self, text):
        """Analyze note for summary, key points, difficulty, and Bloom's level"""
        prompt = f"""
        Analyze the following note and return a comprehensive JSON response with:
        1. An EXTENSIVE detailed summary (15-25 sentences minimum) that should include:
           - Introduction to the main topic and its significance
           - Historical context or background information
           - Detailed explanation of core concepts and mechanisms
           - Relationships between different components or ideas
           - Current understanding and recent developments
           - Practical implications and real-world relevance
           - Challenges, limitations, or controversies if applicable
           - Future directions or potential developments
           - Connections to related fields or disciplines
           - Conclusion emphasizing the importance and broader impact
        
        2. 8-12 comprehensive key points (each should be 2-3 sentences explaining the concept in detail)
        3. Difficulty level (Easy, Medium, or Hard) with justification
        4. Bloom's Taxonomy level (Remember, Understand, Apply, Analyze, Evaluate, or Create) with reasoning
        5. Tags (array of 8-12 relevant topic keywords including subtopics)
        6. Learning objectives (5-8 specific, measurable learning goals)
        7. Prerequisites (detailed concepts and knowledge needed)
        8. Applications (comprehensive real-world uses, examples, and case studies)

        Text: {text}

        Respond ONLY with valid JSON in this exact format:
        {{
            "summary": "EXTENSIVE 15-25 sentence comprehensive summary that thoroughly covers the topic from introduction through historical context, detailed mechanisms, current understanding, practical implications, challenges, future directions, interdisciplinary connections, and concluding with broader significance. This should be a complete, scholarly-level overview that leaves no important aspect unexplored...",
            "key_points": ["Comprehensive point 1 with detailed explanation spanning 2-3 sentences that fully explores this concept", "Detailed point 2 with extensive context and examples that thoroughly explains the mechanism or idea", ...],
            "difficulty": "Easy|Medium|Hard",
            "bloom_level": "Remember|Understand|Apply|Analyze|Evaluate|Create",
            "tags": ["primary_topic", "subtopic1", "subtopic2", "related_field", "methodology", "application1", "application2", "concept1", ...],
            "learning_objectives": ["Detailed objective 1 with specific measurable outcome", "Comprehensive objective 2 with clear learning target", ...],
            "prerequisites": ["Detailed prerequisite 1 with explanation of why it's needed", "Comprehensive prerequisite 2 with context", ...],
            "applications": ["Detailed real-world application 1 with specific examples and case studies", "Comprehensive application 2 with practical implementation details", ...]
        }}
        """
        
        if not self.client:
            return self._fallback_analysis()
            
        try:
            response = self.client.chat.completions.create(
                messages=[{"role": "user", "content": prompt}],
                model=self.model,
                temperature=0.3
            )
            
            content = response.choices[0].message.content.strip()
            # Extract JSON from response
            json_match = re.search(r'\{.*\}', content, re.DOTALL)
            if json_match:
                return json.loads(json_match.group())
            else:
                return self._fallback_analysis()
                
        except Exception as e:
            print(f"Groq API error: {e}")
            return self._fallback_analysis()
    
    def generate_topic_graph(self, text):
        """Generate topic graph for mind mapping"""
        prompt = f"""
        Extract main topics and subtopics from this note for a mind map.
        Return a JSON array where each object has:
        - id: unique identifier
        - label: display name
        - children: array of related subtopic strings

        Text: {text}

        Respond ONLY with valid JSON array:
        [
            {{"id": "main_topic", "label": "Main Topic", "children": ["subtopic1", "subtopic2"]}},
            ...
        ]
        """
        
        if not self.client:
            return self._fallback_graph()
            
        try:
            response = self.client.chat.completions.create(
                messages=[{"role": "user", "content": prompt}],
                model=self.model,
                temperature=0.3
            )
            
            content = response.choices[0].message.content.strip()
            json_match = re.search(r'\[.*\]', content, re.DOTALL)
            if json_match:
                return json.loads(json_match.group())
            else:
                return self._fallback_graph()
                
        except Exception as e:
            print(f"Groq API error: {e}")
            return self._fallback_graph()
    
    def generate_quiz(self, text):
        """Generate MCQ quiz from note"""
        prompt = f"""
        Generate 3-5 multiple choice questions from this note.
        For each question provide:
        - question: the question text
        - options: array of 4 options (A, B, C, D)
        - correct_answer: the correct option letter

        Text: {text}

        Respond ONLY with valid JSON array:
        [
            {{
                "question": "What is...?",
                "options": ["Option A", "Option B", "Option C", "Option D"],
                "correct_answer": "A"
            }},
            ...
        ]
        """
        
        if not self.client:
            return self._fallback_quiz()
            
        try:
            response = self.client.chat.completions.create(
                messages=[{"role": "user", "content": prompt}],
                model=self.model,
                temperature=0.4
            )
            
            content = response.choices[0].message.content.strip()
            json_match = re.search(r'\[.*\]', content, re.DOTALL)
            if json_match:
                return json.loads(json_match.group())
            else:
                return self._fallback_quiz()
                
        except Exception as e:
            print(f"Groq API error: {e}")
            return self._fallback_quiz()
    
    def compare_notes(self, note1, note2):
        """Compare two notes semantically"""
        prompt = f"""
        Compare these two notes and return:
        1. Similarity score (0-100)
        2. Comparison summary explaining similarities and differences

        Note A: {note1}

        Note B: {note2}

        Respond ONLY with valid JSON:
        {{
            "similarity_score": 85,
            "comparison_summary": "Both notes discuss... However, Note A focuses on... while Note B emphasizes..."
        }}
        """
        
        if not self.client:
            return {"similarity_score": 50, "comparison_summary": "Comparison unavailable - API key not configured"}
            
        try:
            response = self.client.chat.completions.create(
                messages=[{"role": "user", "content": prompt}],
                model=self.model,
                temperature=0.3
            )
            
            content = response.choices[0].message.content.strip()
            json_match = re.search(r'\{.*\}', content, re.DOTALL)
            if json_match:
                return json.loads(json_match.group())
            else:
                return {"similarity_score": 50, "comparison_summary": "Unable to analyze comparison"}
                
        except Exception as e:
            print(f"Groq API error: {e}")
            return {"similarity_score": 0, "comparison_summary": "Error in comparison analysis"}
    
    def _fallback_analysis(self):
        """Fallback response when API fails"""
        return {
            "summary": "This comprehensive analysis system is currently unavailable due to an API configuration issue, but this extended fallback response demonstrates the type of detailed, scholarly-level summaries that would normally be generated. The Smart Note Analyzer is designed to provide extensive, multi-paragraph summaries that thoroughly explore topics from multiple angles, beginning with foundational concepts and building toward advanced applications. When properly configured with a valid Groq API key, the system would analyze your input text and generate detailed summaries spanning 15-25 sentences that cover historical context, current understanding, practical implications, and future directions. The analysis would include comprehensive explanations of core mechanisms, relationships between different components, and connections to related fields of study. Additionally, the system would identify potential challenges, limitations, or controversies within the subject matter, providing a balanced and nuanced perspective. The generated content would maintain academic rigor while remaining accessible, incorporating recent developments and emerging trends in the field. Furthermore, the analysis would explore interdisciplinary connections, demonstrating how the topic relates to broader areas of knowledge and research. The summary would conclude by emphasizing the broader significance and impact of the subject matter, helping users understand not just what the topic is, but why it matters in both theoretical and practical contexts. This fallback response serves as an example of the comprehensive, detailed analysis that users can expect when the system is fully operational with proper API credentials configured.",
            "key_points": [
                "The Smart Note Analyzer is designed to generate extensive, scholarly-level summaries that provide comprehensive coverage of topics. These summaries typically span 15-25 sentences and include detailed explanations of core concepts, historical context, and practical applications.",
                "When properly configured, the system analyzes input text using advanced AI models to extract key insights and present them in a structured, academic format. The analysis includes multiple perspectives and maintains objectivity while exploring complex relationships between different concepts.",
                "The fallback system demonstrates the application's resilience and user-focused design philosophy. Even when external services are unavailable, users receive informative responses that explain the situation and provide guidance for resolution.",
                "Comprehensive analysis includes exploration of historical development, current understanding, and future directions within the subject matter. This multi-temporal perspective helps users understand how knowledge has evolved and where it might be heading.",
                "The system is designed to identify and explain interdisciplinary connections, showing how topics relate to broader fields of study. This approach helps users develop a more holistic understanding of complex subjects.",
                "Quality analysis includes discussion of challenges, limitations, and controversies within the field. This balanced approach ensures users receive nuanced perspectives rather than oversimplified explanations.",
                "The generated content maintains academic rigor while remaining accessible to diverse audiences. Technical concepts are explained clearly without sacrificing depth or accuracy.",
                "Real-world applications and practical implications are emphasized throughout the analysis. Users learn not just theoretical concepts but also how knowledge translates into practical solutions and innovations."
            ],
            "difficulty": "Medium",
            "bloom_level": "Understand",
            "tags": ["system_analysis", "api_configuration", "error_handling", "fallback_mechanisms", "user_experience", "comprehensive_analysis", "academic_writing", "knowledge_synthesis"],
            "learning_objectives": [
                "Understand the importance of proper API configuration and authentication in modern web applications",
                "Learn to implement robust error handling and fallback mechanisms in software systems",
                "Develop appreciation for comprehensive analysis and scholarly writing approaches",
                "Recognize the value of detailed, multi-perspective examination of complex topics",
                "Understand how AI-powered analysis tools can enhance learning and knowledge synthesis"
            ],
            "prerequisites": ["Basic understanding of API keys and web service authentication", "Familiarity with error handling concepts in software development", "General knowledge of academic writing and analysis principles"],
            "applications": ["Error handling and graceful degradation in web applications", "System diagnostics and troubleshooting procedures", "User experience design for robust applications", "Academic writing and comprehensive analysis methodologies", "AI-powered educational tools and learning enhancement systems"]
        }
    
    def _fallback_graph(self):
        """Fallback graph when API fails"""
        return [{"id": "main", "label": "Main Topic", "children": ["Subtopic 1", "Subtopic 2"]}]
    
    def _fallback_quiz(self):
        """Fallback quiz when API fails"""
        return [{
            "question": "Quiz generation unavailable",
            "options": ["A", "B", "C", "D"],
            "correct_answer": "A"
        }]