# Programming Architecture
> 

> Created: Date:     2015-10-Aug By Minchiuan

> Last Updated Date: 2015-10-Aug By Minchiuan

## 0.Reference

### Name

* ThisIsTheClass
* this\_is\_package\_name
* this\_is\_medod\_name
* this\_is\_function\_name
 
## 1.Architecture of 3dilove
	
### package: utility
> #### Engineer: Minchiuan Gao, Jinakun Chen
		
*  **IpHandler** 
> Minchiuan Gao
>> _handle the ip address and other access information_

*  **EncodeHandler**
> Minchiuan Gao
>> _handle different encoding problem_

*  **StaticHandler**	
> Jiankun Chen
>> _handle static files, for example, images, stl files_

*  **NumberHandler** 
> Jiankun Chen
>> _handler number functions, as give the random number, etc._

*  **PageHandler**:		
> Jiankun Chen
>> _handler number functions, as give the random number, etc._

*  **json\_to\_tuple**: 
> Jiankun Chen
>> *change json to tuple*


### package: configuration
> ####  Engineer: Minchiuan Gao
* **static\_file\_server**
>> _define static file server information_

>>> * toy\_server\_path
>>> * toy\_server\_upload
>>> * toy\_server\_download
>>> * toy\_server\_ip


* **identity**
>>> define the tags and other global information



### package: account
> #### Engineer: Junhui Wang
* **AccountHandler**
>> + send\_verfiy\_message()
>> + beta\_apply()
>> + phone\_exit()
>> + user\_name\_exit()
>> + user\_register()
>> + user\_login()
>> + change\_pwd()
>> + change\_username()
>> + phote\_change()
>> + img\_change()
>> + alipay\_change()
>> + forget\_password()
>> + reset\_password()


### package: payment
> #### Engineer: Junhui Wang

* **CartHandler**

>> + add\_to\_cart():
>> + dalete\_from\_cart(id\_list):

* **OrderList**

>> + get\_order\_list()
>> + add\_order()
>> + modify\_order()

* **Payment**

>> + alipay()
>> + tenpay()
>> + give\_recall\_url()

### package: shop
> #### Engineer: Jinakun Chen

* **utility**
> **GoodsHandler**
>> _get goods, set goods, sort goods, filter\_goods_ , etc

* **VendorHandler**
>> _get vendors, set vendors, etc_

* **Social**
> **MarkHandler**
>> _add\_mark()_
>> _cancle\_mark()_
>> _etc_

> **CollectionHandler**


### package: designer
> #### Engineer: Jie Ren

* **DesignerHandler**
>> _edit\_person\_information; get\_desiger(), etc_

* **Editor**
>> _the function of edit work, show workm etc_

> end
