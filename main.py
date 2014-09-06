#!/usr/bin/env python
#
# Copyright 2007 Google Inc.
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.
#
import webapp2
import jinja2
import os
import urllib
from google.appengine.ext import ndb

apikey = '2f2aee936736fe734d68'
class MapHandler(webapp2.RequestHandler):
  def get(self):
    template_values = {}
    template = jinja_environment.get_template('map.html')
    self.response.out.write(template.render(template_values))

class IndexHandler(webapp2.RequestHandler):
  def get(self):
    template_values = {}
    template = jinja_environment.get_template('index.html')
    self.response.out.write(template.render(template_values))

class DiseaseHandler(webapp2.RequestHandler):
	def get(self):
		template_values = {}
		template = jinja_environment.get_template('data.xml')
		xmlurl = 'http://www.tycho.pitt.edu/api/diseases?apikey=' + apikey
		xml = urllib.urlopen(xmlurl).read()
		template_values = {'xml':xml}
		self.response.headers['Access-Control-Allow-Origin'] = '*'
		self.response.headers['Content-Type'] = 'text/xml'
		self.response.out.write(template.render(template_values))

class CityHandler(webapp2.RequestHandler):
	def get(self):
		template_values = {}
		template = jinja_environment.get_template('data.xml')
		xmlurl = 'http://www.tycho.pitt.edu/api/cities?apikey=' + apikey
		xml = urllib.urlopen(xmlurl).read()
		template_values = {'xml':xml}
		self.response.headers['Access-Control-Allow-Origin'] = '*'
		self.response.headers['Content-Type'] = 'text/xml'
		self.response.out.write(template.render(template_values))

class StateHandler(webapp2.RequestHandler):
	def get(self):
		template_values = {}
		template = jinja_environment.get_template('data.xml')
		xmlurl = 'http://www.tycho.pitt.edu/api/states?apikey=' + apikey
		xml = urllib.urlopen(xmlurl).read()
		template_values = {'xml':xml}
		self.response.headers['Access-Control-Allow-Origin'] = '*'
		self.response.headers['Content-Type'] = 'text/xml'
		self.response.out.write(template.render(template_values))



jinja_environment = jinja2.Environment(loader=
  jinja2.FileSystemLoader(os.path.dirname(__file__)))

app = webapp2.WSGIApplication([
  ('/map', MapHandler),
  ('/index', IndexHandler),
  ('/listDiseases', DiseaseHandler),
  ('/listCities', CityHandler),
  ('/listStates', StateHandler),
  #('/stateData', StateDataHandler),
  #('/cityData', CityDataHandler),
], debug=True)
