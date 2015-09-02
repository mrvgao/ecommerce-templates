#coding=utf-8
from django.core.exceptions import ObjectDoesNotExist
from operator import attrgetter
import heapq

from configuration.models import Goods

from utility.common_handler import CommonHandler

class GoodsHandler(object):

    def __init__(self):
        self.common_handler = CommonHandler()

    def get_goods_by_id(self,goods_id):
        try:
            goods = Goods.objects.get(id = goods_id)
        except ObjectDoesNotExist:
            goods = None
        return goods


    def get_all_goods_by_style(self,style):
        goods_style = self.common_handler.utf_to_unicode(style)
        all_goods_list = Goods.objects.all()
        goods_list = self.get_match_list(all_goods_list,goods_style)
        return goods_list


    def get_goods_by_style(self,goods_list,goods_style):
        goods_style = self.common_handler.utf_to_unicode(goods_style)
        style_goods_list = self.get_match_list(goods_list,goods_style)
        return style_goods_list


    def get_match_list(self,goods_list,style):
        match_list = []
        for goods in goods_list:
            goods_style = goods.style.replace('u\'','\'')
            goods_style.decode("unicode-escape")
            if goods_style.find(style) >= 0:
                match_list.append(goods)
        return match_list


    def get_all_goods_by_tags(self,goods_tags):
        goods_tags = self.common_handler.utf_to_unicode(goods_tags)
        goods_list = Goods.objects.filter(tags = goods_tags)
        return goods_list


    def get_goods_by_tags(self, goods_list, goods_tags):
        goods_tags = self.common_handler.utf_to_unicode(goods_tags)
        tags_goods_list = goods_list.filter(tags=goods_tags)
        return tags_goods_list


    def get_goods_by_designer(self,designer_id):
        goods_list = Goods.objects.filter(designer_id = designer_id)
        return goods_list


    def set_collected_count(self,goods,count):
        goods.collected_count += count
        goods.save()


    def get_other_goods(self, designer_id, goods_id):
        goods_list = Goods.objects.filter(designer_id=designer_id).exclude(id=goods_id)
        return goods_list


    def sort_by_download(self, goods_list, order=True):
        return_list = sorted(goods_list, key=attrgetter('download_count'), reverse=order)
        return return_list


    def sort_by_collect(self, goods_list, order=True):
        return_list = sorted(goods_list, key=attrgetter('collected_count'), reverse=order)
        return return_list


    def sort_by_time(self, goods_list, order=True):
        return_list = sorted(goods_list, key=attrgetter('approval_time'), reverse=order)
        return return_list


    def comprehension_sort(self, goods_list):
        return_list = sorted(goods_list, key=attrgetter('download_count', 'collected_count', 'approval_time'))
        return return_list


class RecommendGoodsHandler(object):

    def __init__(self):
        self.goods_handler = GoodsHandler()
        self.common_handler = CommonHandler()


    def get_recommend_by_id(self,goods_id):
        goods_style = Goods.objects.get(id=goods_id).style
        style_list = self.get_style_list(goods_style)
        score_dict = self.get_score_dict(style_list, goods_id)
        score_list = self.get_score_list(score_dict)
        recommend_list = self.get_recommend_list(score_list)
        return  recommend_list


    def get_style_list(self,goods_style):
        goods_style = self.common_handler.utf_to_unicode(goods_style)
        style_list = goods_style.split(',')
        return style_list


    def get_score_dict(self,style_list, goods_id):
        score_dict = {}
        for style in style_list:
            self.get_score_by_style(style,score_dict, goods_id)
        return score_dict


    def get_score_by_style(self, style, score_dict, goods_id):
        all_goods = Goods.objects.all().exclude(id=goods_id)
        for goods in all_goods:
            goods_style = goods.style.replace('u\'','\'')
            goods_style.decode('unicode-escape')
            if goods_style.find(style) >= 0:
                self.add_dict_value(score_dict, goods.id)
            elif not score_dict.has_key(goods_id):
                score_dict[goods_id] = 0


    def add_dict_value(self, score_dict, goods_id):
        if score_dict.has_key(goods_id):
            score_dict[goods_id] += 1
        else:
            score_dict[goods_id] = 1


    def get_score_list(self,score_dict):
        score_list = []
        for key in score_dict:
            temp = (score_dict[key],key)
            score_list.append(temp)
        return score_list


    def get_recommend_list(self,score_list):
        recommend_number = 4
        recommend_list = heapq.nlargest(recommend_number, score_list)
        goods_id_list = []
        for recommend_id in recommend_list:
            goods_id_list.append(recommend_id[1])
        return goods_id_list
