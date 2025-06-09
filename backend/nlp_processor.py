import os
import math
from pydub import AudioSegment
import speech_recognition as sr
import spacy
from typing import Dict, List, Tuple, Optional

# Load spaCy model with all pipelines
nlp = spacy.load("en_core_web_sm")

# Your existing district data structure
data = {
  "Anakapalli": ["Anakapalli", "Bheemunipatnam", "Bowluvada", "Butchayyapeta", "Cheedikada", "Chodavaram", "Devarapalli", "Elamanchili", "Golugonda", "K. Kotapadu", "Kantabamsuguda", "Kasimkota", "Madugula", "Makavarapalem", "Munagapaka", "Nakkapalle", "Narsipatnam", "Narsipatnam revenue division", "Nathavaram", "Paravada", "Payakaraopeta", "Rambilli", "Ravikamatham", "Rolugunta", "Sabbavaram", "S. Rayavaram", "Vizianagaram", "Yellamanchili"],
  "Ananthapuramu": ["Adoni", "Amarapuram", "Anantapur", "Antakal", "Anugula", "Atmakur", "Bathalapalle", "Beluguppa", "Bukkapatnam", "Brahmanapalle", "Byrampuram", "Challakere", "Chilamathur", "Chinna Manchikonda", "Chinna Veeranagallu", "Chitravati", "Cuddapah", "Dharmavaram", "Dhone", "Donakonda", "Gooty", "Gummagatta", "Hindupur", "Hirehalli", "Hospet", "Kadiri", "Kalyandurgam", "Kamalapuram", "Kanaganapalli", "Kurnool", "Madakasira", "Madanapalle", "Mantralayam", "Muddenahalli", "Nandyal", "Nemili", "Penukonda", "Puttaparthi", "Rayachoty", "Santhapuram", "Singanamala", "Tadipatri", "Uravakonda", "Vaddadi", "Vaddamanu", "Vinukonda", "Guntakal", "PamidiNagar", "Rayadurg"],
  "Annamayya": ["Beerangi Kothakota", "Kalikiri", "Kurabalakota", "Madanapalle", "Mulakalacheruvu", "Nimmanapalle", "Peddamandyam", "Peddathippasamudram", "Ramasamudram", "Thamballapalle", "Valmikipuram", "Chitvel", "Nandalur", "Obulavaripalle", "Penagalur", "Pullampeta", "Railway Koduru", "Rajampet", "T. Sundupalle", "Veeraballi", "Chinnamandyam", "Galiveedu", "Gurramkonda", "Kalakada", "Kambhamvaripalle", "Lakkireddypalli", "Pileru", "Ramapuram", "Rayachoti", "Sambepalli"],
  "Alluri Sitharama Raju": ["Chinturu", "Etapaka", "Kunavaram", "Vararamachandrapuram", "Ananthagiri", "Araku Valley", "Chintapalli", "Dumbriguda", "Ganagaraju Madugula", "Gudem Kotha Veedhi", "Hukumpeta", "Koyyuru", "Munchingi Puttu", "Paderu", "Peda Bayalu", "Addateegala", "Devipatnam", "Gangavaram", "Maredumilli", "Rajavommangi", "Rampachodavaram", "Y. Ramavaram"],
  "Bapatla": ["Bapatla", "Karlapalem", "Martur", "Parchur", "Pittalavanipalem", "Yeddanapudi", "Addanki", "Ballikurava", "Chinaganjam", "Chirala", "Inkollu", "J. Panguluru", "Karamchedu", "Korisapadu", "Santhamaguluru", "Vetapalem", "Amruthalur", "Bhattiprolu", "Cherukupalle", "Kollur", "Nagaram", "Nizampatnam", "Repalle", "Tsundur", "Vemuru"],
  "Chittoor": ["Chittoor Rural", "Chittoor Urban", "Gangadhara Nellore", "Gudipala", "Irala", "Penumuru", "Pulicherla", "Puthalapattu", "Rompicherla", "Srirangarajapuram", "Thavanampalle", "Vedurukuppam", "Yadamari", "Gudupalle", "Kuppam", "Ramakuppam", "Santhipuram", "Karvetinagar", "Nagari", "Nindra", "Palasamudram", "Vijayapuram", "Baireddipalle", "Bangarupalyam", "Chowdepalle", "Gangavaram", "Palamaner", "Peddapanjani", "Punganur", "Sodam", "Somala", "Venkatagirikota"],
  "East Godavari": ["Rajamahendravaram", "Kadiam", "Rajanagaram", "Seethanagaram", "Korukonda", "Anaparthi", "Biccavolu", "Rangampeta", "Gokavaram", "Kovvuru", "Chagallu", "Tallapudi", "Nidadavole", "Undrajavaram", "Peravali", "Devarapalle", "Nallajerla", "Gopalapuram"],
  "Eluru": ["Bhimadole", "Denduluru", "Eluru", "Kaikalur", "Kalidindi", "Mandavalli", "Mudinepalli", "Nidamarru", "Pedapadu", "Pedavegi", "Buttayagudem", "Dwaraka Tirumala", "Jangareddygudem", "Jeelugu Milli", "Kamavarapukota", "Koyyalagudem", "Kukunuru", "Polavaram", "T. Narasapuram", "Velairpadu", "Agiripalli", "Chatrai", "Chintalapudi", "Lingapalem", "Musunuru", "Nuzvid"],
  "Guntur": ["Guntur","Guntur East", "Guntur West", "Medikonduru", "Pedakakani", "Pedanandipadu", "Phirangipuram", "Prathipadu", "Tadikonda", "Thullur", "Vatticherukuru", "Chebrolu", "Duggirala", "Kakumanu", "Kollipara", "Mangalagiri", "Ponnur", "Tadepalle", "Tenali"],
  "Kakinada": ["Samalkota", "Pithapuram", "Gollaprolu", "U. Kothapalli", "Karapa", "Kakinada Rural", "Kakinada Urban", "Pedapudi", "Thallarevu", "Kajuluru", "Peddapuram", "Jaggampeta", "Gandepalle", "Kirlampudi", "Tuni", "Kotananduru", "Prathipadu", "Sankhavaram", "Yeleswaram", "Rowthulapudi", "Thondangi"],
  "Konaseema": ["Allavaram", "Amalapuram", "I. Polavaram", "Katrenikona", "Malikipuram", "Mamidikuduru", "Mummidivaram", "Razole", "Sakhinetipalle", "Uppalaguptam", "Ainavilli", "Alumuru", "Ambajipeta", "Atreyapuram", "Kothapeta", "P. Gannavaram", "Ravulapalem", "Gangavaram", "Kapileswarapuram", "Mandapeta", "Rayavaram", "Ramachandrapuram"],
  "Krishna": ["Bapulapadu", "Gannavaram", "Gudivada", "Gudlavalleru", "Nandivada", "Pedaparupudi", "Unguturu", "Avanigadda", "Bantumilli", "Challapalli", "Ghantasala", "Guduru", "Koduru", "Kruthivennu", "Machilipatnam North", "Machilipatnam South", "Mopidevi", "Nagayalanka", "Pedana", "Kankipadu", "Movva", "Pamarru", "Pamidimukkala", "Penamaluru", "Thotlavalluru", "Vuyyuru"],
  "Kurnool": ["Adoni", "Gonegandla", "Holagunda", "Kosigi", "Kowthalam", "Mantralayam", "Nandavaram", "Pedda Kadabur", "Yemmiganur", "C. Belagal", "Gudur", "Kallur", "Kodumur", "Kurnool Rural", "Kurnool Urban", "Orvakal", "Veldurthi", "Alur", "Aspari", "Chippagiri", "Devanakonda", "Halaharvi", "Krishnagiri", "Maddikera East", "Pattikonda", "Tuggali"], 
  "Nandyal": ["Atmakur", "Bandi Atmakur", "Jupadu Bunglow", "Kothapalle", "Miduthuru", "Nandikotkur", "Pagidyala", "Pamulapadu", "Srisailam", "Velugodu", "Banaganapalli", "Bethamcherla", "Dhone", "Koilkuntla", "Owk", "Peapully", "Allagadda", "Chagalamarri", "Dornipadu", "Gadivemula", "Gospadu", "Kolimigundla", "Mahanandi", "Nandyal Rural", "Nandyal Urban", "Panyam", "Rudravaram", "Sanjamala", "Sirivella", "Uyyalawada"],
  "Nellore": ["Ananthasagaram", "Anumasamudrampeta", "Atmakur", "Chejerla", "Kaluvoya", "Marripadu", "Sangam", "Seetharamapuram", "Udayagiri", "Gudluru", "Kandukur", "Kondapuram", "Lingasamudram", "Ulavapadu", "Varikuntapadu", "Voletivaripalem", "Allur", "Bogole", "Dagadarthi", "Duttalur", "Jaladanki", "Kaligiri", "Kavali", "Kodavalur", "Vidavalur", "Vinjamur", "Buchireddipalem", "Indukurpet", "Kovur", "Manubolu", "Muthukur", "Nellore Rural", "Nellore Urban", "Podalakur", "Rapur", "Sydapuram", "Thotapalli Gudur", "Venkatachalam"], 
  "NTR": ["Chandarlapadu", "Jaggayyapeta", "Kanchikacherla", "Nandigama", "Penuganchiprolu", "Vatsavai", "Veerullapadu", "A. Konduru", "Gampalagudem", "Reddigudem", "Tiruvuru", "Vissannapeta", "G. Konduru", "Ibrahimpatnam", "Mylavaram", "Vijayawada Rural", "Vijayawada Central", "Vijayawada North", "Vijayawada East", "Vijayawada West"],
   "Palnadu": ["Dachepalle", "Durgi", "Gurazala", "Karempudi", "Machavaram", "Macherla", "Piduguralla", "Rentachintala", "Veldurthi", "Bollapalle", "Chilakaluripeta", "Edlapadu", "Ipur", "Nadendla", "Narasaraopet", "Nuzendla", "Rompicherla", "Savalyapuram", "Vinukonda", "Amaravathi", "Atchampet", "Bellamkonda", "Krosuru", "Muppalla", "Nekarikallu", "Pedakurapadu", "Rajupalem", "Sattenapalli"], 
   "Parvathipuram Manyam": ["Jiyyammavalasa", "Gummalaxmipuram", "Kurupam", "Palakonda", "Seethampeta", "Bhamini", "Veeraghattam", "Parvathipuram", "Seethanagaram", "Balijipeta", "Salur", "Panchipenta", "Makkuva", "Komarada", "Garugubilli"], 
   "Prakasam": ["Chandrasekharapuram", "Darsi", "Donakonda", "Hanumanthunipadu", "Kanigiri", "Konakanamitla", "Kurichedu", "Marripudi", "Pamur", "Pedacherlopalle", "Podili", "Ponnaluru", "Veligandla", "Ardhaveedu", "Bestavaripeta", "Cumbum", "Dornala", "Giddalur", "Komarolu", "Markapuram", "Pedda Araveedu", "Pullalacheruvu", "Racherla", "Tarlupadu", "Tripuranthakam", "Yerragondapalem", "Chimakurthy", "Kondapi", "Kothapatnam", "Maddipadu", "Mundlamuru", "Naguluppalapadu", "Ongole Rural", "Ongole Urban", "Santhanuthalapadu", "Singarayakonda", "Tanguturu", "Thallur", "Zarugumalli"], 
   "Rayalaseema": ["Anantapur", "Guntakal", "Hindupur", "Kadiri", "Rayadurg", "Tadipatri", "Dharmavaram", "Kalyandurg"], "Srikakulam": ["Ichchapuram", "Kaviti", "Sompeta", "Kanchili", "Palasa", "Mandasa", "Vajrapukotturu", "Nandigama", "Srikakulam", "Gara", "Amadalavalasa", "Ponduru", "Sarubujjili", "Burja", "Narasannapeta", "Polaki", "Etcherla", "Laveru", "Ranastalam", "Ganguvarisigadam", "Jalumuru", "Tekkali", "Santha Bommali", "Kotabommali", "Pathapatnam", "Meliaputti", "Saravakota", "Kothuru", "Hiramandalam", "Lakshminarasupeta"], 
   "Sri Sathya Sai": ["Bathalapalle", "Chennekothapalle", "Dharmavaram", "Kanaganapalle", "Mudigubba", "Ramagiri", "Tadimarri", "Amadagur", "Gandlapenta", "Kadiri", "Nallacheruvu", "Nambulapulakunta", "Talupula", "Tanakal", "Agali", "Amarapuram", "Chilamathur", "Gudibanda", "Hindupur", "Lepakshi", "Madakasira", "Parigi", "Penukonda", "Roddam", "Rolla", "Somandepalle", "Bukkapatnam", "Gorantla", "Kothacheruvu", "Nallamada", "Obuladevaracheruvu", "Puttaparthi"], 
   "Tirupati": ["Tirupati","Balayapalli", "Chillakur", "Chittamur", "Dakkili", "Gudur", "Kota", "Vakadu", "Venkatagiri", "K. V. B. Puram", "Nagalapuram", "Narayanavanam", "Pichatur", "Renigunta", "Srikalahasti", "Thottambedu", "Yerpedu", "Buchinaidu Kandriga", "Doravarisatram", "Naidupeta", "Ozili", "Pellakur", "Satyavedu", "Sullurpeta", "Tada", "Varadaiahpalem", "Chandragiri", "Chinnagottigallu", "Pakala", "Puttur", "Ramachandrapuram", "Tirupati Rural", "Tirupati Urban", "Vadamalapeta", "Yerravaripalem"], 
   "Visakhapatnam": ["Bheemunipatnam", "Anandapuram", "Padmanabham", "Visakhapatnam Rural", "Seethammadhara", "Gajuwaka", "Pedagantyada", "Gopalapatnam", "Mulagada", "Maharanipeta", "Pendurthi"],
   "Vizianagaram": ["Bobbili", "Ramabhadrapuram", "Badangi", "Therlam", "Gajapathinagaram", "Dattirajeru", "Mentada", "Cheepurupalli", "Garividi", "Gurla", "Merakamudidam", "Vangara", "Regidi Amadalavalasa", "Santhakavati mandal", "Rajam", "Vizianagaram Urban", "Gantyada", "Poosapatirega", "Denkada", "Bhogapuram", "Srungavarapukota", "Jami", "Vepada", "Lakkavarapukota", "Kothavalasa", "Bondapalli", "Nellimarla", "Vizianagaram Rural"],
  
   "YSR Kadapa": ["Atlur", "B. Kodur", "Badvel", "Bramhamgari Matham", "Chapadu", "Duvvur", "Gopavaram", "Kalasapadu", "Khajipet", "Mydukur", "Porumamilla", "Sri Avadhutha Kasinayana", "Jammalamadugu", "Kondapuram", "Muddanur", "Mylavaram", "Peddamudium", "Proddatur", "Rajupalem", "Chennur", "Chinthakommadinne", "Kadapa", "Kamalapuram", "Pendlimarri", "Siddavatam", "Vallur", "Vontimitta", "Yerraguntla", "Chakarayapet", "Lingala", "Pulivendula", "Simhadripuram", "Thondur", "Veerapunayunipalle", "Vempalle", "Vemula"] 
}


def convert_to_wav(input_file: str) -> str:
    """Converts an audio file to WAV format."""
    try:
        audio = AudioSegment.from_file(input_file)
        wav_path = os.path.join("temp", "temp_audio.wav")
        audio.export(wav_path, format="wav")
        return wav_path
    except Exception as e:
        print(f"Error converting audio: {e}")
        return None

def process_large_audio(file_path: str, chunk_duration: int = 30) -> Optional[str]:
    """Processes large audio files in chunks and transcribes them."""
    recognizer = sr.Recognizer()
    complete_text = []

    try:
        print(f"Starting audio processing for {file_path}...")

        if not file_path.lower().endswith('.wav'):
            file_path = convert_to_wav(file_path)
            if file_path is None:
                raise Exception("Audio conversion failed")

        audio = AudioSegment.from_wav(file_path)
        duration = len(audio)
        chunk_size = chunk_duration * 1000
        chunks = math.ceil(duration / chunk_size)
        print(f"Audio duration: {duration} ms, processing in {chunks} chunks.")

        for i in range(chunks):
            start_time = i * chunk_size
            end_time = min((i + 1) * chunk_size, duration)
            chunk = audio[start_time:end_time]
            
            chunk_path = os.path.join("static/uploads", f"temp_chunk_{i}.wav")
            chunk.export(chunk_path, format="wav")
            print(f"Processing chunk {i + 1}/{chunks}...")

            with sr.AudioFile(chunk_path) as source:
                try:
                    audio_data = recognizer.record(source)
                    text = recognizer.recognize_google(audio_data)
                    complete_text.append(text)
                except sr.UnknownValueError:
                    print(f"Could not understand chunk {i + 1}")
                except sr.RequestError as e:
                    print(f"Speech recognition request error: {e}")

            os.remove(chunk_path)

        if file_path.startswith(os.path.join("static/uploads", "temp_audio")):
            os.remove(file_path)

        return " ".join(complete_text)

    except Exception as e:
        print(f"Error during audio processing: {e}")
        return None

def get_location_matches(text: str, data: Dict[str, List[str]]) -> List[Tuple[str, str, float]]:
    """
    Find location matches in text using multiple NLP techniques.
    Returns list of (location, district, confidence) tuples.
    """
    matches = []
    doc = nlp(text)
    
    # Convert text and locations to lowercase for comparison
    text_lower = text.lower()
    
    # 1. Direct matching with NER entities
    ner_locations = {ent.text.lower() for ent in doc.ents if ent.label_ in ["GPE", "LOC"]}
    
    # 2. Tokenize text for word-by-word matching
    text_tokens = {token.text.lower() for token in doc if not token.is_punct and not token.is_space}
    
    # 3. Find matches using both NER and token matching
    for district, locations in data.items():
        for location in locations:
            location_lower = location.lower()
            
            # Calculate confidence based on different matching methods
            confidence = 0.0
            
            # Check exact matches in NER entities (highest confidence)
            if location_lower in ner_locations:
                confidence = 0.9
            # Check exact matches in tokenized text
            elif location_lower in text_tokens:
                confidence = 0.7
            # Check partial matches in text
            elif location_lower in text_lower:
                confidence = 0.5
            
            if confidence > 0:
                matches.append((location, district, confidence))
    
    return sorted(matches, key=lambda x: x[2], reverse=True)

def predict_district(text: str, data: Dict[str, List[str]]) -> dict:
    """
    Predicts the district based on the transcribed text with improved accuracy.
    Returns a dictionary with prediction results and metadata.
    """
    if not text or not text.strip():
        return {
            "status": "error",
            "message": "No text provided for analysis.",
            "predicted_district": []
        }

    # Get location matches with confidence scores
    matches = get_location_matches(text, data)
    
    if not matches:
        # Try more aggressive text normalization
        normalized_text = " ".join(token.lemma_.lower() for token in nlp(text)
                                 if not token.is_punct and not token.is_space)
        matches = get_location_matches(normalized_text, data)
        
        if not matches:
            return {
                "status": "error",
                "message": "No location entities detected in the audio.",
                "predicted_district": []
            }

    # Format results
    predicted_district = []
    seen_districts = set()
    
    for location, district, confidence in matches:
        if district not in seen_districts:
            predicted_district.append(district)
            seen_districts.add(district)
    
    return {
        "status": "success",
        "message": "Found matching locations",
        "predicted_district": [district for district in seen_districts],
        "transcribed_text": text
    }

def process_audio_file(file_path: str) -> dict:
    """
    Main function to process audio file and predict district.
    Returns a dictionary with all results and metadata.
    """
    try:
        # Create temp directory if it doesn't exist
        os.makedirs("temp", exist_ok=True)
        
        # Process the audio file
        transcribed_text = process_large_audio(file_path)
        
        if not transcribed_text:
            return {
                "status": "error",
                "message": "Failed to transcribe audio file",
                "transcribed_text": None,
                "predicted_district": []
            }
        
        # Get predictions
        result = predict_district(transcribed_text, data)
        return result
        
    except Exception as e:
        return {
            "status": "error",
            "message": f"Error processing audio file: {str(e)}",
            "transcribed_text": None,
            "predicted_district": []
        }

# Example usage:
if __name__ == "__main__":
    # Replace with your audio file path
    audio_file_path = "path/to/your/audio/file.mp3"
    result = process_audio_file(audio_file_path)

    print("\nProcessing Results:")
    if result['transcribed_text']:
        print(f"\nTranscribed Text: {result['transcribed_text']}")

    if result['predicted_district']:
        print("\npredicted_district:")
        for pred in result['predicted_district']:
            # Only print the district name
            print(f"District: {pred['district']}")
            break

# if __name__ == "__main__":
#     # Replace with your audio file path
#     audio_file_path = "path/to/your/audio/file.mp3"
#     result = process_audio_file(audio_file_path)
#     print("\nProcessing Results:")
#     # print(f"Status: {result['status']}")
#     # print(f"Message: {result['message']}")
#     if result['transcribed_text']:
#         print(f"\nTranscribed Text: {result['transcribed_text']}")
#     if result['predictions']:
#         print("\nPredictions:")
#         for pred in result['predictions']:
#             print(f"District: {pred['district']}")
#             # print(f"Location: {pred['location']} -> District: {pred['district']} "
#             #       f"(Confidence: {pred['confidence']})")