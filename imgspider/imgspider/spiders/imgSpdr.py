# -*- coding: utf-8 -*-
import scrapy

from imgspider.items import ImgspiderItem
from scrapy.crawler import CrawlerProcess

class ImgspdrSpider(scrapy.Spider):
    name = 'imgSpdr'
    allowed_domains = []
    start_urls = ['http://jandan.net/ooxx']

    def parse(self, response):
        item = ImgspiderItem()
        # item['image_urls'] = response.xpath('//img//@src').extract()
        item['image_urls'] = response.xpath('//a[@class="view_img_link"]//@href').extract()
        print('image_urls', item['image_urls'])
        yield item
        
        # images = response.xpath('//ol[@class="commentlist"]/li')
        # for img in images:
        #     item = ImgspiderItem()
        #     item['url'] = img.xpath('//a[@class="view_img_link"]//@href').extract_first()
        #     yield item

        # new_url = response.xpath('//a[@class="previous-comment-page"]//@href').extract_first()
        # print('new_urls', new_url)
        # if new_url:
        #     yield scrapy.Request(new_url, callback=self.parse)
