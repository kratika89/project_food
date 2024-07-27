function showPicture(){
    const selectedFile=foodpicture.files[0]
    fp.width=50  
    fp.src=URL.createObjectURL(selectedFile)
}
$(document).ready(function(){
    $.get('/food/fillcategory',function(response){
        response.data.map((item)=>{
            $('#category_id').append($('<option>').text(item.category_name).val(item.category_id))
        })
    })
    $('#category_id').change(function(){
        $.get('/food/fillsubcategory',{category_id:$('#category_id').val()},function(response){
            $('#subcategory_id').empty()
            $('#subcategory_id').append($('<option>').text('Select Subcategory'))
            response.data.map((item)=>{
                $('#subcategory_id').append($('<option>').text(item.subcategoryname).val(item.subcategory_id))
            })
        })
    })
})