import time

from django.contrib.auth import get_user_model
from django.test import TestCase
from justchat.models import Message
from channels.testing import ChannelsLiveServerTestCase
from selenium import webdriver
from selenium.webdriver.common.action_chains import ActionChains
from selenium.webdriver.common.by import By
from selenium.webdriver.support.wait import WebDriverWait

User = get_user_model()


class TestAppModels(TestCase):

    def test_model_str_and_content(self):
        user = User.objects.create(username='polenom')
        message = Message.objects.create(
            author=user,
            content='Helloy'
        )
        self.assertEqual(str(message), 'polenom')
        self.assertEqual(message.content, 'Helloy')


class TestChat(ChannelsLiveServerTestCase):
    serve_static = True

    @classmethod
    def setUpClass(cls) -> None:
        super().setUpClass()
        try:
            cls.driver = webdriver.Chrome()
        except:
            super().tearDownClass()
            raise

    @classmethod
    def tearDownClass(cls) -> None:
        cls.driver.quit()
        super().tearDownClass()

    def test_when_chat_message_posted_then_seen_by_everyone_in_same_room(self):
        try:
            User.objects.create_superuser(username='admin',password='admin')
            self._reg_user('admin','admin')
            self._enter_chat_room('room_1')
            self._open_new_window()
            self._enter_chat_room('room_2')
            self._switch_to_window(0)
            self._post_message('hello')
            WebDriverWait(self.driver, 2).until(lambda _: 'hello' in self._chat_log_value, "Message wasn't recive in window 1")
            self._switch_to_window(0)
            self._post_message('world')
            WebDriverWait(self.driver, 2).until(lambda _: 'world' in self._chat_log_value, "Message wasn't recive in window 2")
            self.assertTrue('hello' in self._chat_log_value, 'Message 1 isn\'t in window 2' )
        finally:
            self._close_all_new_windows()

    def _enter_chat_room(self, room_name):
        self.driver.get(self.live_server_url+'/chat/')
        ActionChains(self.driver).send_keys(room_name + '\n').perform()
        WebDriverWait(self.driver, 2).until(lambda _: room_name in self.driver.current_url)

    def _reg_user(self, username, pasword):
        self.driver.get(self.live_server_url +  '/admin/')
        self.driver.find_element('id','id_username').send_keys(username)
        self.driver.find_element('id', 'id_password').send_keys(pasword)
        self.driver.find_element('class name', 'submit-row').find_element('tag name', 'input').click()

    def _open_new_window(self):
        self.driver.execute_script('window.open("about:blank", "_blank")')
        self._switch_to_window(-1)

    def _switch_to_window(self, window_index):
        self.driver.switch_to.window(self.driver.window_handles[window_index])

    def _close_all_new_windows(self):
        while len(self.driver.window_handles) > 1:
            self._switch_to_window(-1)
            self.driver.execute_script('window.close()')
        if len(self.driver.window_handles) == 1:
            self._switch_to_window(0)

    def _post_message(self, message):
        ActionChains(self.driver).send_keys(message +' \n').perform()

    @property
    def _chat_log_value(self):
        return [ i.get_attribute('innerHTML').rstrip() for i in self.driver.find_elements(by=By.CSS_SELECTOR, value="#chat-log p")]


