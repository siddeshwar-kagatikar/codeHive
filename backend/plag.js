// Import necessary library
const natural = require("natural");

// Function to tokenize the code and compute Cosine Similarity
function calculateCosineSimilarity(text1, text2) {
  const tokenizer = new natural.WordTokenizer();
  const tokens1 = tokenizer.tokenize(text1.toLowerCase());
  const tokens2 = tokenizer.tokenize(text2.toLowerCase());

  // Create a set of unique tokens from both texts
  const allTokens = Array.from(new Set([...tokens1, ...tokens2]));

  // Create vectors for each text based on token frequencies
  const vector1 = allTokens.map(token => tokens1.filter(t => t === token).length);
  const vector2 = allTokens.map(token => tokens2.filter(t => t === token).length);

  // Calculate the dot product and magnitudes
  const dotProduct = vector1.reduce((sum, _, i) => sum + vector1[i] * vector2[i], 0);
  const magnitude1 = Math.sqrt(vector1.reduce((sum, val) => sum + val ** 2, 0));
  const magnitude2 = Math.sqrt(vector2.reduce((sum, val) => sum + val ** 2, 0));

  // Calculate and return the cosine similarity
  return magnitude1 && magnitude2 ? dotProduct / (magnitude1 * magnitude2) : 0;
}

// Function to check for plagiarism among students' code
function checkPlagiarism(codeSubmissions) {
  const results = [];
  const n = codeSubmissions.length;

  // Compare each pair of code submissions
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      const similarity = calculateCosineSimilarity(
        codeSubmissions[i].code,
        codeSubmissions[j].code
      );

      results.push({
        student1: codeSubmissions[i].studentId,
        student2: codeSubmissions[j].studentId,
        similarity: (similarity * 100).toFixed(2) + "%",
      });
    }
  }

  return results;
}

// Example usage
const submissions = [
  { studentId: "S1", code: "function add(a, b) { return a + b; }" },
  { studentId: "S2", code: "function add(x, y) { return x + y; }" },
  { studentId: "S3", code: "def add(a, b): return a + b" },
  { studentId: "S4", code: "console.log('Hello World!');" },
];

// const plagiarismResults = checkPlagiarism(submissions);

// console.log("Plagiarism Check Results:");
// console.log(plagiarismResults);


// Exporting the functions
module.exports = {
    calculateCosineSimilarity,
    checkPlagiarism,
  };
