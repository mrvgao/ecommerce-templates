import random


class AlgorithmHandler(object):

    def generate_no_repeat_number(self,low,high,number):
        max_value = 100
        return_list = []
        flag = [0] * max_value
        for i in range(number):
            temp_number = random.randint(low,high -  1)
            while flag[temp_number] == 1:
                temp_number = random.randint(low,high - 1)
            flag[temp_number] = 1
            return_list.append(temp_number)
        return return_list


    def get_certain_number_list(self,list,certain_number):
        if(len(list) <= certain_number):
            return list
        else:
            return list[0:certain_number]
