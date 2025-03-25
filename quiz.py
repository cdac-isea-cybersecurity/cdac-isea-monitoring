from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import time

# Set up WebDriver with Service and Chrome binary location
driver_path = "C:/chromedriver-win64/chromedriver.exe"
chrome_binary_path = "C:/Program Files/Google/Chrome/Application/chrome.exe"
profile_path = "C:/Users/gmonk/AppData/Local/Google/Chrome/User Data"  # Only up to 'User Data'
service = Service(executable_path=driver_path)

chrome_options = Options()
chrome_options.binary_location = chrome_binary_path
chrome_options.add_argument(f"user-data-dir={profile_path}")
chrome_options.add_argument("profile-directory=Default")
chrome_options.add_argument("--no-sandbox")
chrome_options.add_argument("--disable-dev-shm-usage")
chrome_options.add_argument("--remote-debugging-port=9222")
chrome_options.add_argument("--disable-gpu")
chrome_options.add_argument("--headless")  # Uncomment if you want to run Chrome in headless mode

driver = webdriver.Chrome(service=service, options=chrome_options)

# Define the URL
url = "https://ciso.isea.app/quiz/zfTTwvoubbg0"

# Function to complete the quiz
def complete_quiz():
    # Open the URL
    driver.get(url)

    # Wait for the Start button to be clickable and click it
    start_button = WebDriverWait(driver, 10).until(
        EC.element_to_be_clickable((By.XPATH, "//div[@id='root']/div/div[3]/div/div/div/div/button"))
    )
    start_button.click()

    # Answer the questions (click the first option for each question)
    for i in range(1, 7):
        option = WebDriverWait(driver, 10).until(
            EC.element_to_be_clickable((By.XPATH, f"//div[@class='MuiPaper-root'][{i}]"))
        )
        option.click()
        time.sleep(1)  # Adding a small delay between clicks

    # Click the Submit button
    submit_button = WebDriverWait(driver, 10).until(
        EC.element_to_be_clickable((By.XPATH, "//button[contains(text(),'Submit')]"))
    )
    submit_button.click()

    # Adding a delay to allow the page to load before restarting the process
    time.sleep(3)

# Loop to repeat the quiz process
for _ in range(5):  # Adjust the range for the number of times you want to repeat
    complete_quiz()

# Close the browser
driver.quit()
