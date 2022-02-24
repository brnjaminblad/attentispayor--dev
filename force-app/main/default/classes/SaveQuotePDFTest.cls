@isTest
public class SaveQuotePDFTest {    

    @isTest public static void testSaveQuoteDocument (){
        
		String methodName = 'saveQuoteDocument';
        map<String,Object> inputMap = new map <String, Object>();
        map<String,Object> outMap = new map <String, Object>();
        map<String,Object> options = new map <String, Object>();
        
        SaveQuotePDF testSavePDF = new SaveQuotePDF();
        //Test.startTest();
        testSavePDF.invokeMethod(methodName, inputMap, outMap, options);
        //Test.stopTest();
    }
    
}