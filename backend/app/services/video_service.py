# services.py
import os
import logging
import spacy
import speech_recognition as sr
from moviepy.video.io.VideoFileClip import VideoFileClip
from datetime import datetime
from typing import Dict, Optional, Tuple
from app import db
from app.models import VideoUser


# Configure logging 
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Load NLP model with error handling
try:
    nlp = spacy.load("en_core_web_sm")
except OSError:
    logger.error("Failed to load spaCy model. Make sure 'en_core_web_sm' is installed")
    raise


district_data = {
    "Anakapalli": [
        "Anakapalli", "Bheemunipatnam", "Bowluvada", "Butchayyapeta", 
        "Cheedikada", "Chodavaram", "Devarapalli", "Elamanchili", 
        "Golugonda", "K. Kotapadu", "Kantabamsuguda", "Kasimkota", 
        "Madugula", "Makavarapalem", "Munagapaka", "Nakkapalle", 
        "Narsipatnam", "Narsipatnam revenue division", "Nathavaram", 
        "Paravada", "Payakaraopeta", "Rambilli", "Ravikamatham", 
        "Rolugunta", "Sabbavaram", "S. Rayavaram", "Vizianagaram", 
        "Yellamanchili"], "Ananthapuramu": ["Adoni", "Amarapuram", "Anantapur", "Antakal", "Anugula", "Atmakur", "Bathalapalle", "Beluguppa", "Bukkapatnam", "Brahmanapalle", "Byrampuram", "Challakere", "Chilamathur", "Chinna Manchikonda", "Chinna Veeranagallu", "Chitravati", "Cuddapah", "Dharmavaram", "Dhone", "Donakonda", "Gooty", "Gummagatta", "Hindupur", "Hirehalli", "Hospet", "Kadiri", "Kalyandurgam", "Kamalapuram", "Kanaganapalli", "Kurnool", "Madakasira", "Madanapalle", "Mantralayam", "Muddenahalli", "Nandyal", "Nemili", "Penukonda", "Puttaparthi", "Rayachoty", "Santhapuram", "Singanamala", "Tadipatri", "Uravakonda", "Vaddadi", "Vaddamanu", "Vinukonda", "Guntakal", "PamidiNagar", "Rayadurg"],
  "Annamayya": ["Beerangi Kothakota", "Kalikiri", "Kurabalakota", "Madanapalle", "Mulakalacheruvu", "Nimmanapalle", "Peddamandyam", "Peddathippasamudram", "Ramasamudram", "Thamballapalle", "Valmikipuram", "Chitvel", "Nandalur", "Obulavaripalle", "Penagalur", "Pullampeta", "Railway Koduru", "Rajampet", "T. Sundupalle", "Veeraballi", "Chinnamandyam", "Galiveedu", "Gurramkonda", "Kalakada", "Kambhamvaripalle", "Lakkireddypalli", "Pileru", "Ramapuram", "Rayachoti", "Sambepalli"],
  "Alluri Sitharama Raju": ["Chinturu", "Etapaka", "Kunavaram", "Vararamachandrapuram", "Ananthagiri", "Araku Valley", "Chintapalli", "Dumbriguda", "Ganagaraju Madugula", "Gudem Kotha Veedhi", "Hukumpeta", "Koyyuru", "Munchingi Puttu", "Paderu", "Peda Bayalu", "Addateegala", "Devipatnam", "Gangavaram", "Maredumilli", "Rajavommangi", "Rampachodavaram", "Y. Ramavaram"],
  "Bapatla": ["Bapatla", "Karlapalem", "Martur", "Parchur", "Pittalavanipalem", "Yeddanapudi", "Addanki", "Ballikurava", "Chinaganjam", "Chirala", "Inkollu", "J. Panguluru", "Karamchedu", "Korisapadu", "Santhamaguluru", "Vetapalem", "Amruthalur", "Bhattiprolu", "Cherukupalle", "Kollur", "Nagaram", "Nizampatnam", "Repalle", "Tsundur", "Vemuru"],
  "Chittoor": ["Chittoor Rural", "Chittoor Urban", "Gangadhara Nellore", "Gudipala", "Irala", "Penumuru", "Pulicherla", "Puthalapattu", "Rompicherla", "Srirangarajapuram", "Thavanampalle", "Vedurukuppam", "Yadamari", "Gudupalle", "Kuppam", "Ramakuppam", "Santhipuram", "Karvetinagar", "Nagari", "Nindra", "Palasamudram", "Vijayapuram", "Baireddipalle", "Bangarupalyam", "Chowdepalle", "Gangavaram", "Palamaner", "Peddapanjani", "Punganur", "Sodam", "Somala", "Venkatagirikota"],
  "East Godavari": ["Rajamahendravaram", "Kadiam", "Rajanagaram", "Seethanagaram", "Korukonda", "Anaparthi", "Biccavolu", "Rangampeta", "Gokavaram", "Kovvuru", "Chagallu", "Tallapudi", "Nidadavole", "Undrajavaram", "Peravali", "Devarapalle", "Nallajerla", "Gopalapuram"],
  "Eluru": ["Bhimadole", "Denduluru", "Eluru", "Kaikalur", "Kalidindi", "Mandavalli", "Mudinepalli", "Nidamarru", "Pedapadu", "Pedavegi", "Buttayagudem", "Dwaraka Tirumala", "Jangareddygudem", "Jeelugu Milli", "Kamavarapukota", "Koyyalagudem", "Kukunuru", "Polavaram", "T. Narasapuram", "Velairpadu", "Agiripalli", "Chatrai", "Chintalapudi", "Lingapalem", "Musunuru", "Nuzvid"],
  "Guntur": ["Guntur","Guntur East", "Guntur West", "Medikonduru", "Pedakakani", "Pedanandipadu", "Phirangipuram", "Prathipadu", "Tadikonda", "Thullur", "Vatticherukuru", "Chebrolu", "Duggirala", "Kakumanu", "Kollipara", "Mangalagiri", "Ponnur", "Tadepalle", "Tenali"],
  "Kakinada": ["Samalkota", "Pithapuram", "Gollaprolu", "U. Kothapalli", "Karapa", "Kakinada Rural","kakinada", "Kakinada Urban", "Pedapudi", "Thallarevu", "Kajuluru", "Peddapuram", "Jaggampeta", "Gandepalle", "Kirlampudi", "Tuni", "Kotananduru", "Prathipadu", "Sankhavaram", "Yeleswaram", "Rowthulapudi", "Thondangi"],
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


class VideoProcessingError(Exception):
    """Custom exception for video processing errors"""
    pass

def extract_audio_from_video(video_path: str) -> Optional[str]:
    """
    Extracts audio from video file and saves as WAV.
    
    Args:
        video_path: Path to video file
        
    Returns:
        Path to extracted audio file or None if failed
        
    Raises:
        VideoProcessingError: If audio extraction fails
    """
    if not os.path.exists(video_path):
        raise VideoProcessingError(f"Video file not found: {video_path}")
        
    audio_path = video_path.replace(".mp4", ".wav")
    try:
        video = VideoFileClip(video_path)
        if video.audio is None:
            raise VideoProcessingError("No audio track found in video")
            
        video.audio.write_audiofile(audio_path, codec='pcm_s16le')
        video.close()
        return audio_path
        
    except Exception as e:
        logger.error(f"Audio extraction failed: {str(e)}")
        raise VideoProcessingError(f"Failed to extract audio: {str(e)}")

def transcribe_audio(audio_path: str) -> str:
    """
    Transcribes speech from audio file to text.
    
    Args:
        audio_path: Path to audio file
        
    Returns:
        Transcribed text
        
    Raises:
        VideoProcessingError: If transcription fails
    """
    if not os.path.exists(audio_path):
        raise VideoProcessingError(f"Audio file not found: {audio_path}")
        
    recognizer = sr.Recognizer()
    try:
        with sr.AudioFile(audio_path) as source:
            audio = recognizer.record(source)
        text = recognizer.recognize_google(audio)
        return text
    except sr.UnknownValueError:
        raise VideoProcessingError("Audio could not be transcribed - speech unclear")
    except sr.RequestError as e:
        raise VideoProcessingError(f"Speech recognition service error: {str(e)}")
    except Exception as e:
        raise VideoProcessingError(f"Transcription failed: {str(e)}")

def predict_district(text: str) -> Tuple[str, float]:
    """
    Predicts district from text using NLP.
    
    Args:
        text: Input text
        
    Returns:
        Tuple of (predicted district, confidence score)
        
    Raises:
        VideoProcessingError: If prediction fails
    """
    try:
        doc = nlp(text)
        max_confidence = 0
        predicted_district = "Unknown"
        
        for ent in doc.ents:
            for district, places in district_data.items():
                if ent.text in places:
                    confidence = ent._.confidence if hasattr(ent._, 'confidence') else 0.8
                    if confidence > max_confidence:
                        max_confidence = confidence
                        predicted_district = district
                        
        return predicted_district, max_confidence
        
    except Exception as e:
        raise VideoProcessingError(f"District prediction failed: {str(e)}")

def process_video_submission(
    category: str,
    video_path: str,
    submitted_by: str
) -> Dict:
    """
    Processes video submission through the full pipeline.
    
    Args:
        category: Text input from user
        video_path: Path to uploaded video
        submitted_by: Username of submitter
        
    Returns:
        Dict containing processing results
        
    Raises:
        VideoProcessingError: If any step fails
    """
    logger.info(f"Processing video submission from {submitted_by}")
    
    try:
        # Extract audio
        audio_path = extract_audio_from_video(video_path)
        
        # Transcribe audio
        transcribed_text = transcribe_audio(audio_path)
        
        # Predict district
        district, confidence = predict_district(transcribed_text)
        
        # Save to database
        relative_video_path = os.path.relpath(video_path, start=os.path.join(os.getcwd(), "static/uploads"))
        new_entry = VideoUser(
            category=category,
            video_file=relative_video_path,
            transcribed_text=transcribed_text,
            predicted_district=district,
            submitted_by=submitted_by,
            submission_status="Processed",
            confidence_score=confidence
        )
        
        db.session.add(new_entry)
        db.session.commit()
        
        # Cleanup
        if os.path.exists(audio_path):
            os.remove(audio_path)
            
        return {
            "message": "Video processed successfully",
            "prediction_district": district,
            "confidence": confidence,
            "transcribed_text": transcribed_text
        }
        
    except Exception as e:
        db.session.rollback()
        logger.error(f"Video processing failed: {str(e)}")
        
        # Save failed status to database
        try:
            failed_entry = VideoUser(
                category=category,
                video_file=video_path,
                submitted_by=submitted_by,
                submission_status="Failed",
                transcribed_text=f"Processing failed: {str(e)}"
            )
            db.session.add(failed_entry)
            db.session.commit()
        except Exception as db_error:
            logger.error(f"Failed to record error in database: {str(db_error)}")
            
        raise VideoProcessingError(f"Video processing failed: {str(e)}")

