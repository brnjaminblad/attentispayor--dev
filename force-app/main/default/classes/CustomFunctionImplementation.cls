global class CustomFunctionImplementation implements vlocity_ins.VlocityOpenInterface
{
    /*
        inputs - arguments - List<Object> of passed in arguments
        output - result - The result of the Function being called. Supports single Object values, List<Object> or Map<String, Object>
    */
    global Boolean invokeMethod(String methodName, Map<String, Object> inputs, Map<String, Object> output, Map<String, Object> options) {
        List<Object> arguments = (List<Object>)inputs.get('arguments');
        
        if (methodName == 'sum') {
            output.put('result', sum(arguments));
        } else if (methodName == 'split') {
            output.put('result', split(arguments));
        } else if (methodName == 'getBoardCertificationSourcesOptions') {
            output.put('result', getBoardCertificationSourcesOptions(inputs, output, options));
        } else if (methodName == 'getSecondaryLanguages') {
            output.put('result', getSecondaryLanguages(arguments));
        }
        return true;
    }
    
    Double sum(List<Object> arguments) {
        Double result = 0;
        for(Object token : arguments)
        {
            if (token != null)
            {
                result += (Double)token;
            }
        }
        return result;
    }
    
    List<String> split(List<Object> arguments) {
        String toSplit = (String)arguments[0];
        String splitter = (String)arguments[1];
        return toSplit.split(splitter);
    }
    
    public Map<String, Object> getBoardCertificationSourcesOptions(Map<String, Object> input, Map<String, Object> output, Map<String, Object> options) {
        List<Map<String, Object>> result = new List<Map<String, Object>>();
        
        Map<String, Object> tempMap = new Map<String, Object>();
        tempMap.put('name', JSON.serialize(input));
        tempMap.put('value', JSON.serialize(output));
        
        result.add(tempMap);
        output.put('options', result);
        return output;
    }
    
    List<String> getSecondaryLanguages(List<Object> arguments) {
        String allLanguages = (String) arguments[0];
        String[] splittedLanguages = allLanguages.split(';');
        String[] secondaryLanguages = new List<String>();
        for (String language : splittedLanguages) {
            if (language != 'English') {
                secondaryLanguages.add(language);
            }
        }
        return secondaryLanguages;
    }
}