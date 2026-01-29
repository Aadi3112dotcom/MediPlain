import Tesseract from 'tesseract.js';

/**
 * Extract text from medical report image using OCR
 */
export const extractTextFromImage = async (imageFile) => {
  try {
    const result = await Tesseract.recognize(
      imageFile,
      'eng',
      {
        logger: m => console.log('OCR Progress:', m)
      }
    );
    
    return {
      text: result.data.text,
      confidence: result.data.confidence,
      raw: result.data
    };
  } catch (error) {
    console.error('OCR extraction error:', error);
    throw error;
  }
};

/**
 * Extract structured data from medical report
 */
export const parsemedicalReport = (extractedText) => {
  try {
    const lines = extractedText.split('\n').filter(line => line.trim());
    
    const report = {
      raw: extractedText,
      sections: {},
      keyValues: {}
    };
    
    // Extract common medical report sections
    const sections = ['test result', 'normal range', 'reference', 'remarks', 'diagnosis', 'prescription'];
    
    let currentSection = 'general';
    const sectionContent = {};
    
    for (const line of lines) {
      const lowerLine = line.toLowerCase();
      
      // Check if line contains a section header
      const foundSection = sections.find(s => lowerLine.includes(s));
      if (foundSection) {
        currentSection = foundSection;
        sectionContent[currentSection] = [];
      } else {
        if (!sectionContent[currentSection]) {
          sectionContent[currentSection] = [];
        }
        sectionContent[currentSection].push(line);
      }
      
      // Extract key-value pairs (e.g., "Hemoglobin: 13.5 g/dL")
      const kvMatch = line.match(/^([^:]+):\s*(.+)$/);
      if (kvMatch) {
        report.keyValues[kvMatch[1].trim()] = kvMatch[2].trim();
      }
    }
    
    report.sections = sectionContent;
    return report;
  } catch (error) {
    console.error('Medical report parsing error:', error);
    return null;
  }
};

/**
 * Process image file and extract text
 */
export const processReportImage = async (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = async (e) => {
      try {
        const result = await extractTextFromImage(e.target.result);
        const parsed = parsemedicalReport(result.text);
        
        resolve({
          ...result,
          parsed,
          fileName: file.name,
          fileSize: file.size,
          uploadedAt: new Date().toISOString()
        });
      } catch (error) {
        reject(error);
      }
    };
    
    reader.onerror = () => reject(new Error('File reading failed'));
    reader.readAsArrayBuffer(file);
  });
};
