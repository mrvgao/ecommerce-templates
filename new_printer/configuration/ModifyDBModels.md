# Modify DBModels.py

> Created: Date:2015-08-14 by wangjh

## 2015.08.14 by wangjh
### alert Vender_Goods
>>
-collected_time = models.DateTimeField(blank=True)
*collected_time = models.DateTimeField(null=True, blank=True)*
>>
-download_time = models.DateTimeField(blank=True)
*download_time = models.DateTimeField(null=True, blank=True)*
>>
-buy_time = models.DateTimeField(blank=True)
*buy_time = models.DateTimeField(null=True, blank=True)*
