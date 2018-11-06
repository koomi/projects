# -*- coding: utf-8 -*-

# Define your item pipelines here
#
# Don't forget to add your pipeline to the ITEM_PIPELINES setting
# See: https://doc.scrapy.org/en/latest/topics/item-pipeline.html
import os

class MoviespiderPipeline(object):
    def process_item(self, item, spider):
        with open("my_meiju.txt",'a') as fp:
            # fp.write(str(item['name'].encode("utf8") + b'\n'))
            fp.write(str(item['name'].encode("utf8")))
